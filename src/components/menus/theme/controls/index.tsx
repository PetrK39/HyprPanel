import { Gtk } from 'astal/gtk3';
import { Option } from 'src/components/settings/shared/Option';

// investigate wrong option color on dark/light mode switch
// missing classes?
export default (): JSX.Element => {
    return (
        <box className={'theme-card'} hexpand={true} vertical={true}>
            <box className={'theme-card-label-container'} halign={Gtk.Align.FILL}>
                <label className={'theme-card-label'} halign={Gtk.Align.START} hexpand={true} label={`Matugen`} />
            </box>
            <box className={'theme-card-content'} halign={Gtk.Align.FILL} vertical={true}>
                <box vertical={false}>
                    <Option
                        opt={options.theme.matugen}
                        title="Enable Matugen"
                        type="boolean"
                        dependencies={['matugen', 'swww']}
                    />
                    <Option
                        opt={options.theme.matugen_settings.mode}
                        title="Matugen Theme"
                        type="enum"
                        enums={['light', 'dark']}
                    />
                </box>
                <box vertical={false}>
                    <Option
                        opt={options.theme.matugen_settings.scheme_type}
                        title="Matugen Scheme"
                        type="enum"
                        enums={[
                            'content',
                            'expressive',
                            'fidelity',
                            'fruit-salad',
                            'monochrome',
                            'neutral',
                            'rainbow',
                            'tonal-spot',
                        ]}
                    />
                    <Option
                        opt={options.theme.matugen_settings.variation}
                        title="Matugen Variation"
                        type="enum"
                        enums={[
                            'standard_1',
                            'standard_2',
                            'standard_3',
                            'monochrome_1',
                            'monochrome_2',
                            'monochrome_3',
                            'vivid_1',
                            'vivid_2',
                            'vivid_3',
                        ]}
                    />
                </box>
            </box>
        </box>
    );
};
