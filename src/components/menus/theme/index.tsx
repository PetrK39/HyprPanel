import DropdownMenu from '../shared/dropdown/index.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';
import Preview from './preview';
import Controls from './controls';
import { Gtk } from 'astal/gtk3';

const { transition } = options.menus;

// make scrollable
export default (): JSX.Element => (
    <DropdownMenu
        name={'thememenu'}
        transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}
    >
        <scrollable className={'menu-scroller theme'} vscroll={Gtk.PolicyType.AUTOMATIC} hscroll={Gtk.PolicyType.NEVER}>
            <box vertical={true} hexpand={true} vexpand={true} className={'theme-menu-content'}>
                <Controls />
                <Preview palette={'colors'} />
                <Preview palette={'secondary_colors'} />
                <Preview palette={'tertiary_colors'} />
            </box>
        </scrollable>
    </DropdownMenu>
);
