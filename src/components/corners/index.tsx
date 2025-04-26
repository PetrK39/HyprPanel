import { App, Astal, Widget } from 'astal/gtk3';
import { bind, Binding, Variable } from 'astal';
import options from 'src/options.js';

import AstalHyprland from 'gi://AstalHyprland?version=0.1';
const hyprland = AstalHyprland.get_default();

interface CornersWindowProps {
    monitor: number;
    name: string;
    visible: boolean | Binding<boolean>;
    className?: string | Binding<string>;
    marginTop?: number | Binding<number>;
    marginBottom?: number | Binding<number>;
    onDestroy?: () => void;
}

const CornersWindow = ({
    monitor,
    name,
    visible,
    className,
    marginTop,
    marginBottom,
    onDestroy,
}: CornersWindowProps): JSX.Element => {
    const window = (
        <window
            application={App}
            monitor={monitor}
            name={`${name}-${monitor}`}
            className={className ?? name}
            namespace={name}
            layer={Astal.Layer.TOP}
            anchor={
                Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM
            }
            vexpand={true}
            hexpand={true}
            marginTop={marginTop}
            marginBottom={marginBottom}
            exclusivity={Astal.Exclusivity.IGNORE}
            clickThrough={true}
            visible={visible}
            onDestroy={onDestroy}
        />
    ) as Widget.Window;

    // Workaround for visibility change
    window.connect('show', () => {
        window.clickThrough = true;
    });

    return window;
};

export const ScreenCorners = async (monitor: number): Promise<JSX.Element> => (
    <CornersWindow monitor={monitor} name={'screencorners'} visible={bind(options.corners.enable_screen)} />
);

export const BarCorners = async (monitor: number): Promise<JSX.Element> => {
    // I don't use bar autoHide, so skip that for now

    const marginTop = Variable(0);
    const marginBottom = Variable(0);

    const updateMargins = (): void => {
        hyprland.sync_monitors((hyprland_sync, res) => {
            if (hyprland_sync) {
                const mon = hyprland_sync.get_monitor(monitor);

                // bottom is top, right is bottom. Don't ask, IDK
                marginTop.set(mon.reservedBottom);
                marginBottom.set(mon.reservedRight);
                hyprland_sync.sync_monitors_finish(res);
            }
        });
    };

    options.handler(['theme.bar', 'theme.bar.buttons.workspaces', 'enableBorder'], () => {
        setTimeout(updateMargins, 500);
    });
    setTimeout(updateMargins, 2000);

    const computeClassName = bind(options.theme.bar.location).as((loc) => `barcorners-${loc}`);

    const computeVisibility = Variable.derive(
        [bind(options.theme.bar.floating), bind(options.corners.enable_bar)],
        (floating, enabled) => {
            return enabled && !floating;
        },
    );

    return (
        <CornersWindow
            monitor={monitor}
            name={'barcorners'}
            visible={bind(computeVisibility)}
            className={bind(computeClassName)}
            marginTop={bind(marginTop)}
            marginBottom={bind(marginBottom)}
            onDestroy={() => {
                computeVisibility.drop();
            }}
        />
    );
};
