import { hyprlandService } from '../../lib/constants/services.ts';
import { execAsync, Variable } from 'astal';
import options from '../../options.ts';
import { generateMatugenColors, replaceHexValues } from '../../services/matugen';
import { isHexColor } from '../../globals/variables.ts';
import { initializeTrackers } from '../../scss/optionsTrackers.ts';

const {
    enabled,
    gaps_in,
    gaps_out,
    gaps_workspaces,
    border_size,
    border_rounding,
    active_border,
    active_border_opacity,
    inactive_border,
    inactive_border_opacity,
} = options.hyprland;

let wasModifyed = false;

const transparentize = (color: string, opacity: number): string => {
    const color_no_hash = color.slice(1);
    const opacityHex = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

    return `rgba(${color_no_hash}${opacityHex})`;
};

const applyHyprlandKeywords = async (
    enabled: boolean,
    gaps_in: number,
    gaps_out: number,
    gaps_workspaces: number,
    border_size: number,
    border_rounding: number,
    active_border: string,
    active_border_opacity: number,
    inactive_border: string,
    inactive_border_opacity: number,
): Promise<void> => {
    if (!enabled) {
        if (!wasModifyed) return;

        execAsync(['bash', '-c', 'hyprctl reload config-only']).catch((err) => {
            console.error(`Error sending hyprctl command: ${err?.message}`, err);
        });
        wasModifyed = false;
        return;
    }

    const matugenColors = await generateMatugenColors();

    let active_border_color = transparentize(active_border, active_border_opacity);
    if (isHexColor(active_border) && matugenColors) {
        active_border_color = transparentize(replaceHexValues(active_border, matugenColors), active_border_opacity);
    }

    let inactive_border_color = transparentize(inactive_border, inactive_border_opacity);
    if (isHexColor(inactive_border) && matugenColors) {
        inactive_border_color = transparentize(
            replaceHexValues(inactive_border, matugenColors),
            inactive_border_opacity,
        );
    }

    const keywordMap = {
        'general:gaps_in': gaps_in,
        'general:gaps_out': gaps_out,
        'general:gaps_workspaces': gaps_workspaces,
        'general:border_size': border_size,
        'decoration:rounding': border_rounding,
        'general:col.active_border': active_border_color,
        'general:col.inactive_border': inactive_border_color,
    };

    const keywords = Object.entries(keywordMap)
        .map(([key, value]) => `keyword ${key} ${value}`)
        .join('; ');

    execAsync(['bash', '-c', `hyprctl --batch "${keywords}"`]).catch((err) => {
        console.error(`Error sending hyprctl command: ${err?.message}`, err);
    });

    wasModifyed = true;
};

const hyprlandIntegration = (): void => {
    execAsync(['bash', '-c', 'hyprctl reload config-only']).catch((err) => {
        console.error(`Error sending hyprctl command: ${err?.message}`, err);
    });

    Variable.derive(
        [
            enabled,
            gaps_in,
            gaps_out,
            gaps_workspaces,
            border_size,
            border_rounding,
            active_border,
            active_border_opacity,
            inactive_border,
            inactive_border_opacity,
        ],
        applyHyprlandKeywords,
    );

    const directApply = (): void => {
        void applyHyprlandKeywords(
            enabled.get(),
            gaps_in.get(),
            gaps_out.get(),
            gaps_workspaces.get(),
            border_size.get(),
            border_rounding.get(),
            active_border.get(),
            active_border_opacity.get(),
            inactive_border.get(),
            inactive_border_opacity.get(),
        );
    };

    hyprlandService.connect('config-reloaded', directApply);
    initializeTrackers(directApply);
    options.handler(['theme.matugen_settings'], directApply);
};

export const initializeHyprlandIntegrations = (): void => {
    hyprlandIntegration();
};
