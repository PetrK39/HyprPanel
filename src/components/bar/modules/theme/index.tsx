import { Astal, Gtk } from 'astal/gtk3';
import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.theme;

export const Theme = (): BarBoxChild => {
    const componentClassName = Variable.derive([bind(options.theme.bar.buttons.style)], (style: string) => {
        const styleMap: Record<string, string> = {
            default: 'style1',
            split: 'style2',
            wave: 'style3',
            wave2: 'style3',
        };
        return `theme-container ${styleMap[style]}`;
    });

    const boxChildren = (
        <label halign={Gtk.Align.CENTER} className={'bar-button-icon theme txt-icon bar'} label={''} />
    );

    const component = (
        <box halign={Gtk.Align.START} className={componentClassName()}>
            <box halign={Gtk.Align.START} className={'bar-theme'}>
                {boxChildren}
            </box>
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'theme',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'thememenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.get(), { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.get(), { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get());

                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};
