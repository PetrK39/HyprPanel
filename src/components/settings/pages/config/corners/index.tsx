import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const CornersSettings = (): JSX.Element => {
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
                <Option opt={options.corners.enable_screen} title="Enable Screen Corners" type="boolean" />
                <Option opt={options.corners.enable_bar} title="Enable Bar Corners" type="boolean" />
            </box>
        </scrollable>
    );
};
