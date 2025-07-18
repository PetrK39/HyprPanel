import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/configuration';
import { Gtk } from 'astal/gtk3';

export const PowerMenuSettings = (): JSX.Element => {
    return (
        <scrollable
            name={'Power Menu'}
            className="bar-theme-page paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand
            overlayScrolling
        >
            <box vertical>
                <Header title="Power Menu" />
                <Option opt={options.menus.power.showLabel} title="Show Label" type="boolean" />
                <Option
                    opt={options.menus.power.lowBatteryNotification}
                    title="Show Notification For Low Battery"
                    type="boolean"
                />
                <Option
                    opt={options.menus.power.lowBatteryThreshold}
                    title="Battery Level For Notification"
                    type="number"
                />
                <Option
                    opt={options.menus.power.lowBatteryNotificationTitle}
                    title="Low Battery Notification Title"
                    subtitle="Use $POWER_LEVEL for battery percent"
                    type="string"
                />
                <Option
                    opt={options.menus.power.lowBatteryNotificationText}
                    title="Low Battery Notification Body"
                    subtitle="Use $POWER_LEVEL for battery percent"
                    type="string"
                />
                <Option opt={options.menus.power.shutdown} title="Shutdown Command" type="string" />
                <Option opt={options.menus.power.reboot} title="Reboot Command" type="string" />
                <Option opt={options.menus.power.logout} title="Logout Command" type="string" />
                <Option opt={options.menus.power.sleep} title="Sleep Command" type="string" />
                <Option opt={options.menus.power.lock} title="Lock Command" type="string" />
                <Option opt={options.menus.power.hibernate} title="Hibernate Command" type="string" />
                <Header title="Buttons" />
                <Option
                    opt={options.menus.power.default_action}
                    title="Default Action"
                    type="enum"
                    enums={['lock', 'logout', 'sleep', 'hibernate', 'shutdown', 'reboot', 'cancel']}
                />
                <Option opt={options.theme.bar.menus.menu.power.buttons.radius} title="Radius" type="string" />
                <Option opt={options.theme.bar.menus.menu.power.buttons.size} title="Size" type="string" />
                <Option opt={options.theme.bar.menus.menu.power.buttons.spacing} title="Spacing" type="string" />
            </box>
        </scrollable>
    );
};
