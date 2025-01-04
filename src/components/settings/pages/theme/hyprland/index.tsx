import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const HyprlandTheme = (): JSX.Element => {
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
                <Option opt={options.hyprland.active_border} title="Hyprland Active Border Color" type="color" />
                <Option
                    opt={options.hyprland.active_border_opacity}
                    title="Hyprland Active Border Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option opt={options.hyprland.inactive_border} title="Hyprland Inactive Border Color" type="color" />
                <Option
                    opt={options.hyprland.inactive_border_opacity}
                    title="Hyprland Inactive Border Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
            </box>
        </scrollable>
    );
};
