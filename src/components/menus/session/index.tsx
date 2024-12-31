import { Action } from 'src/lib/types/power.js';
import PopupWindow from '../shared/popup/index.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import { App, Gdk, Gtk } from 'astal/gtk3';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';
import RevealerTransitionType = Gtk.RevealerTransitionType;
import { capitalizeFirstLetter } from 'src/lib/utils';
import { Button } from 'astal/gtk3/widget.ts';
import { Revealer } from 'astal/gtk3/widget';
import { execAsync } from 'astal';
import { Opt } from 'src/lib/option';
import { BindableChild } from 'astal/gtk3/astalify';

const { sleep, reboot, logout, shutdown, hibernate, lock, default_action, showLabel } = options.menus.power;

const { transition } = options.menus;

const ActionOptionMap: { [k in Action]: Opt<string> } = {
    sleep,
    reboot,
    logout,
    shutdown,
    lock,
    hibernate,
};

const SessionButton = ({ action, icon = action }: SessionButtonProps): Gtk.Widget => {
    let isFocused = false;

    const buttonPressHandler = (): void => {
        if (action !== 'cancel') {
            void execAsync(ActionOptionMap[action].get()).catch((err) =>
                console.error(`Failed to execute ${action} command. Error: ${err}`),
            );
        }
        App.get_window('sessionmenu')?.set_visible(false);
    };

    const updateHoverState = (hovered: boolean, setFocus: boolean = false): void => {
        if (setFocus) {
            isFocused = hovered;
        }

        description.set_reveal_child(isFocused || hovered);
        button.toggleClassName('session-button-focused', isFocused || hovered);
    };

    const enterNotifyHandler = (): void => {
        updateHoverState(true);
    };
    const exitNotifyHandler = (): void => {
        updateHoverState(false);
    };
    const focusInHandler = (): void => {
        updateHoverState(true, true);
    };
    const focusOutHandler = (): void => {
        updateHoverState(false, true);
    };

    const revealerSetup = (self: Gtk.Revealer): void => {
        self.add_events(Gdk.EventMask.ENTER_NOTIFY_MASK);
        self.add_events(Gdk.EventMask.LEAVE_NOTIFY_MASK);
        self.add_events(Gdk.EventMask.BUTTON_PRESS_MASK);
        self.set_transition_type(RevealerTransitionType.SLIDE_DOWN);
    };

    const description = (
        <revealer
            valign={Gtk.Align.END}
            transitionDuration={100}
            revealChild={false}
            visible={bind(showLabel)}
            cursor={'pointer'}
            onButtonPressEvent={buttonPressHandler}
            onEnterNotifyEvent={enterNotifyHandler}
            onLeaveNotifyEvent={exitNotifyHandler}
            setup={revealerSetup}
        >
            <label className={'session-button-desc'} label={capitalizeFirstLetter(action)} />
        </revealer>
    ) as Revealer;

    const button = (
        <button
            className={`session-button session-button-${action}`}
            cursor={'pointer'}
            onClicked={buttonPressHandler}
            onEnterNotifyEvent={enterNotifyHandler}
            onLeaveNotifyEvent={exitNotifyHandler}
            onFocusInEvent={focusInHandler}
            onFocusOutEvent={focusOutHandler}
        >
            <overlay overlays={[description]}>
                <label className={'material-icon'} vexpand label={icon} />
            </overlay>
        </button>
    ) as Button;

    button.connect('realize', () => {
        if (action === default_action.get()) {
            button.grab_focus();
        }

        const toplevel = button.get_toplevel();
        if (toplevel && toplevel.is_toplevel()) {
            toplevel.connect('show', () => {
                if (action === default_action.get()) {
                    button.grab_focus();
                }
            });
        }
    });

    return button;
};

const SessionButtonRow = ({ child, children }: SessionButtonRowProps): Gtk.Widget => (
    <box halign={Gtk.Align.CENTER} className={'spacing-h'}>
        {children ?? child}
    </box>
);

export default (): JSX.Element => (
    <PopupWindow
        name={'sessionmenu'}
        transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}
    >
        <box className={'spacing-v'} vertical valign={Gtk.Align.CENTER}>
            <SessionButtonRow>
                <SessionButton action={'lock'} />
                <SessionButton action={'logout'} />
                <SessionButton action={'sleep'} />
            </SessionButtonRow>
            <SessionButtonRow>
                <SessionButton action={'hibernate'} icon={'downloading'} />
                <SessionButton action={'shutdown'} icon={'power_settings_new'} />
                <SessionButton action={'reboot'} icon={'restart_alt'} />
            </SessionButtonRow>
            <SessionButtonRow>
                <SessionButton action={'cancel'} icon={'close'} />
            </SessionButtonRow>
        </box>
    </PopupWindow>
);

interface SessionButtonProps {
    action: Action | 'cancel';
    icon?: string;
}

interface SessionButtonRowProps {
    child?: BindableChild;
    children?: BindableChild[];
}
