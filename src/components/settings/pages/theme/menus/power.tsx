import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/configuration';
import { Gtk } from 'astal/gtk3';

export const PowerMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Power Menu'}
            className="menu-theme-page power paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.power.background.color} title="Background" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.power.background.opacity}
                    title="Opacity"
                    type="number"
                    increment={10}
                    min={0}
                    max={100}
                />
                {/* Buttons Section */}
                <Header title="Buttons" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.opacity}
                    title="Opacity"
                    type="number"
                    min={0}
                    max={100}
                    increment={10}
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.opacity_active}
                    title="Opacity Active"
                    type="number"
                    min={0}
                    max={100}
                    increment={10}
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.individual_colors}
                    title="Individual Colors"
                    subtitle="Use individual colors for each button, Otherwise select variant below"
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.individual_colors_variant}
                    title="Default Button Style"
                    subtitle="Use selected button colors when buttons aren't using individual colors"
                    type="enum"
                    enums={['lock', 'logout', 'sleep', 'hibernate', 'shutdown', 'reboot', 'cancel']}
                    disabledBinding={options.theme.bar.menus.menu.power.buttons.individual_colors}
                />
                {/* Lock Button Section */}
                <Header title="Lock Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.lock.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.lock.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Logout Button Section */}
                <Header title="Logout Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.logout.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.logout.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Sleep Button Section */}
                <Header title="Sleep Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.sleep.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.sleep.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Hibernate Button Section */}
                <Header title="Hibernate Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.hibernate.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.hibernate.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Shutdown Button Section */}
                <Header title="Shutdown Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.shutdown.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.shutdown.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Reboot Button Section */}
                <Header title="Shutdown Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.restart.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.restart.foreground}
                    title="Foreground"
                    type="color"
                />
                {/* Cancel Button Section */}
                <Header title="Shutdown Button" />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.cancel.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.buttons.cancel.foreground}
                    title="Foreground"
                    type="color"
                />
            </box>
        </scrollable>
    );
};
