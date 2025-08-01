import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/configuration';
import { Gtk } from 'astal/gtk3';

export const DashboardMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Dashboard Menu'}
            className="menu-theme-page dashboard paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Card Section */}
                <Header title="Card" />
                <Option opt={options.theme.bar.menus.menu.dashboard.card.color} title="Card" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.background.color}
                    title="Background"
                    type="color"
                />

                {/* Border Section */}
                <Header title="Border" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.border.color}
                    title="Border"
                    type="color"
                />

                {/* Profile Section */}
                <Header title="Profile" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.profile.name}
                    title="Profile Name"
                    type="color"
                />

                {/* Power Menu Section */}
                <Header title="Power Menu" />
                <Option opt={options.theme.bar.menus.menu.dashboard.powermenu.shutdown} title="Shutdown" type="color" />
                <Option opt={options.theme.bar.menus.menu.dashboard.powermenu.restart} title="Restart" type="color" />
                <Option opt={options.theme.bar.menus.menu.dashboard.powermenu.logout} title="Log Out" type="color" />
                <Option opt={options.theme.bar.menus.menu.dashboard.powermenu.sleep} title="Sleep" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.shutdown}
                    title="Shutdown"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.restart}
                    title="Restart"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.logout}
                    title="Log Out"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.sleep}
                    title="Sleep"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.card}
                    title="Confirmation Dialog Card"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.background}
                    title="Confirmation Dialog Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.border}
                    title="Confirmation Dialog Border"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.label}
                    title="Confirmation Dialog Label"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.body}
                    title="Confirmation Dialog Description"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.confirm}
                    title="Confirmation Dialog Confirm Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.deny}
                    title="Confirmation Dialog Cancel Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.powermenu.confirmation.button_text}
                    title="Confirmation Dialog Button Text"
                    type="color"
                />

                {/* Shortcuts Section */}
                <Header title="Shortcuts" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.shortcuts.background}
                    title="Primary"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.shortcuts.text}
                    title="Text"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.shortcuts.recording}
                    title="Recording"
                    subtitle="Color of the Record button when recording is in progress"
                    type="color"
                />

                {/* Controls Section */}
                <Header title="Controls" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.disabled}
                    title="Module Off"
                    subtitle="Button color when element is disabled"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.wifi.background}
                    title="Wifi Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.wifi.text}
                    title="Wifi Button Text"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.bluetooth.background}
                    title="Bluetooth Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.bluetooth.text}
                    title="Bluetooth Button Text"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.notifications.background}
                    title="Notifications Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.notifications.text}
                    title="Notifications Button Text"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.volume.background}
                    title="Volume Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.volume.text}
                    title="Volume Button Text"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.input.background}
                    title="Input Button"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.controls.input.text}
                    title="Input Button Text"
                    type="color"
                />

                {/* Directories Section */}
                <Header title="Directories" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.left.top.color}
                    title="Directory: Left - Top"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.left.middle.color}
                    title="Directory: Left - Middle"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.left.bottom.color}
                    title="Directory: Left - Bottom"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.right.top.color}
                    title="Directory: Right - Top"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.right.middle.color}
                    title="Directory: Right - Middle"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.directories.right.bottom.color}
                    title="Directory: Right - Bottom"
                    type="color"
                />

                {/* System Stats Section */}
                <Header title="System Stats" />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.bar_background}
                    title="Bar Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.cpu.icon}
                    title="CPU Icon"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.cpu.bar}
                    title="CPU Bar"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.cpu.label}
                    title="CPU Label"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.ram.icon}
                    title="RAM Icon"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.ram.bar}
                    title="RAM Bar"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.ram.label}
                    title="RAM Label"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.gpu.icon}
                    title="GPU Icon"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.gpu.bar}
                    title="GPU Bar"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.gpu.label}
                    title="GPU Label"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.disk.icon}
                    title="Disk Icon"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.disk.bar}
                    title="Disk Bar"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.monitors.disk.label}
                    title="Disk Label"
                    type="color"
                />
            </box>
        </scrollable>
    );
};
