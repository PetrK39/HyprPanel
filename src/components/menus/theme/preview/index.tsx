import { ColorCardColumn } from './color_card';
import { HexColor } from 'src/lib/types/options';
import { colors, secondary_colors, tertiary_colors } from '../../../../options.ts';
import { isHexColor } from '../../../../globals/variables.ts';
import { matugenColors, replaceHexValues } from '../../../../services/matugen';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';

const COLUMNS = 3;

export default ({ palette }: PreviewProps): JSX.Element => {
    const children = new Variable([] as JSX.Element[]);
    const reveal = new Variable(palette === 'colors');

    const updatePreview = async (): Promise<void> => {
        children.set(splitArray(await extractColors(palette), COLUMNS).map((ca) => <ColorCardColumn colors={ca} />));
    };

    matugenColors.subscribe(updatePreview);

    options.handler(['theme'], updatePreview);

    void updatePreview();

    return (
        <box className={'theme-card'} hexpand={true} vertical={true}>
            <button
                className={'theme-card-label-container'}
                halign={Gtk.Align.FILL}
                hexpand={true}
                onClick={() => {
                    reveal.set(!reveal.get());
                }}
            >
                <box hexpand={true} vertical={false}>
                    <label
                        halign={Gtk.Align.START}
                        hexpand={true}
                        label={`Preview for "${palette}"`}
                        className={'theme-card-label'}
                    />
                    <label
                        className={'theme-card-label chevron'}
                        halign={Gtk.Align.END}
                        label={bind(reveal).as((state) => (state ? '' : ''))}
                    />
                </box>
            </button>
            <revealer className={'theme-card-content'} halign={Gtk.Align.FILL} revealChild={bind(reveal)}>
                <box homogeneous={true} vertical={false}>
                    {bind(children)}
                </box>
            </revealer>
        </box>
    );
};

async function extractColors(paletteName: keyof typeof PaletteMap): Promise<ColorMap[]> {
    const result = [] as ColorMap[];

    const matugenColorsValues = matugenColors.get();

    const palette = PaletteMap[paletteName];

    for (const [key, value] of Object.entries(palette)) {
        const replacedValue =
            isHexColor(value) && matugenColorsValues !== undefined
                ? replaceHexValues(value, matugenColorsValues)
                : value;

        if (typeof value !== 'undefined' && isHexColor(replacedValue)) {
            result.push({ key: `${paletteName}.${key}`, value: replacedValue });
        }
    }

    return result;
}

function splitArray<T>(arr: T[], n: number): T[][] {
    const result: T[][] = [];
    const chunkSize = Math.ceil(arr.length / n);

    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }

    return result;
}

const PaletteMap = {
    colors: colors,
    secondary_colors: secondary_colors,
    tertiary_colors: tertiary_colors,
};

export interface PreviewProps {
    palette: keyof typeof PaletteMap;
}

export interface ColorMap {
    key: string;
    value: HexColor;
}
