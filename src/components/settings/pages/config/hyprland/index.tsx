import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const HyprlandSettings = (): JSX.Element => {
    return (
        <scrollable
            name={'Hyprland'}
            className="bar-theme-page paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand
            overlayScrolling
        >
            <box vertical>
                <Header title="Hyprland" />
                <Option opt={options.hyprland.enabled} title="Enable Hyprland Integration" type="boolean" />
                <Option
                    opt={options.hyprland.border_size}
                    title="Hyprland Border Size"
                    type="number"
                    increment={1}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.hyprland.border_rounding}
                    title="Hyprland Border Radius"
                    type="number"
                    increment={1}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.hyprland.gaps_in}
                    title="Hyprland Gaps In"
                    type="number"
                    increment={1}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.hyprland.gaps_out}
                    title="Hyprland Gaps Out"
                    type="number"
                    increment={1}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.hyprland.gaps_workspaces}
                    title="Hyprland Gaps Workspaces"
                    type="number"
                    increment={10}
                    min={0}
                    max={500}
                />
            </box>
        </scrollable>
    );
};
