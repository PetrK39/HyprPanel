import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const CornersTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Corners'}
            className="bar-theme-page paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand
            overlayScrolling
        >
            <box vertical>
                <Header title="Corners" />
                <Option opt={options.theme.corners.screen_radius} title="Screen Corners Radius" type="string" />
                <Option opt={options.theme.corners.bar_radius} title="Bar Corners Radius" type="string" />
            </box>
        </scrollable>
    );
};
