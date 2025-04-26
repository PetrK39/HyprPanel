import { ColorMap } from './index.tsx';
import { Gtk, Widget } from 'astal/gtk3';
import { AstalIO, execAsync, timeout } from 'astal';
import { HexColor } from 'src/lib/types/options';

const COPY_LABEL_DELAY = 2000;

const ColorCard = ({ color }: ColorCardProps): JSX.Element => {
    let timer: AstalIO.Time | null = null;

    const copyRoutine = async (value: string): Promise<void> => {
        console.log('copyRoutine0', value);

        execAsync(['wl-copy', value]).catch((error) => {
            console.error(error);
            labelButton.set_label('failed');
        });

        labelButton.set_label('copied');
        labelButton.toggleClassName('copied', true);

        if (timer) timer.cancel();

        timer = timeout(COPY_LABEL_DELAY, () => {
            labelButton.set_label(color.key);
            labelButton.toggleClassName('copied', false);
        });
    };

    const colorButton = (
        <button
            className={'theme-color-card-color'}
            css={`
                background-color: ${color.value};
            `}
            halign={Gtk.Align.START}
            onClicked={async () => {
                await copyRoutine(color.value);
            }}
        >
            <box
                className={'theme-color-card-color border'}
                css={`
                    border-color: ${invertHex(color.value)};
                `}
            />
        </button>
    ) as Widget.Button;

    const labelButton = (
        <button
            label={color.key}
            className={'theme-color-card-label'}
            valign={Gtk.Align.FILL}
            onClicked={async () => {
                await copyRoutine(color.key);
            }}
        />
    ) as Widget.Button;

    return (
        <eventbox
            className={'theme-color-card'}
            tooltipMarkup={`<span text_transform="uppercase">${color.value}</span>\n<span alpha="75%" size="small">Click on label to copy name\nClick on color to copy hex</span>`}
        >
            <box>
                {colorButton}
                {labelButton}
            </box>
        </eventbox>
    );
};

export const ColorCardColumn = ({ colors }: ColorCardColumnProps): JSX.Element => (
    <box vertical={true} className={'theme-color-card-column'}>
        {colors.map((color) => (
            <ColorCard color={color} />
        ))}
    </box>
);

function invertHex(hex: HexColor): HexColor {
    let color = hex.replace(/^#/, '');

    if (color.length === 3) {
        color = color
            .split('')
            .map((char) => char + char)
            .join('');
    }

    const r = 255 - parseInt(color.slice(0, 2), 16);
    const g = 255 - parseInt(color.slice(2, 4), 16);
    const b = 255 - parseInt(color.slice(4, 6), 16);

    const invertedHex = [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('');

    return `#${invertedHex}`;
}

interface ColorCardProps {
    color: ColorMap;
}

export interface ColorCardColumnProps {
    colors: ColorMap[];
}
