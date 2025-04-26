import PopupWindow from '../shared/popup';
import Gtk from 'gi://Gtk?version=3.0';
import { App, Widget } from 'astal/gtk3';
import Apps from 'gi://AstalApps';
import { exec, execAsync, Gio, GLib } from 'astal';
import options from '../../../options.ts';

const DURATION = 500;
const DURATION_S = 200;
const ALLOWMATH = true;
const ALLOWACTION = true;
const ALLOWCOMMAND = true;
const ALLOWSEARCH = true;
const ALLOWWEBSEARCH = true;
const MAX_RESULTS = 10;
const SEARCH_ENGINE = 'https://www.google.com/search?q=';

const appSearch = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
});

const SearchItem = ({
    materialIconName,
    name,
    actionName,
    content,
    onActivate,
    extraClassName = '',
}: SearchItemProps): JSX.Element => {
    const actionText = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={DURATION}
        >
            <label className={'overview-search-results-txt'} label={actionName} />
        </revealer>
    ) as Widget.Revealer;

    const actionTextRevealer = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            transitionDuration={DURATION_S}
        >
            {actionText}
        </revealer>
    ) as Widget.Revealer;

    return (
        <button
            className={`overview-search-result-btn ${extraClassName}`}
            onClicked={onActivate}
            setup={(self) => {
                self.connect('focus-in-event', () => {
                    actionText.set_reveal_child(true);
                    actionTextRevealer.set_reveal_child(true);
                });
                self.connect('focus-out-event', () => {
                    actionText.set_reveal_child(false);
                    actionTextRevealer.set_reveal_child(false);
                });
            }}
        >
            <box>
                <box vertical={false}>
                    <label className={'overview-search-results-icon'} label={materialIconName} />
                    <box vertical={true}>
                        <label
                            halign={Gtk.Align.START}
                            className={'overview-search-results-txt'}
                            label={name}
                            truncate={true}
                        />
                        <label
                            halign={Gtk.Align.START}
                            className={'overview-search-results-txt'}
                            label={content}
                            truncate={true}
                        />
                    </box>
                    <box hexpand={true} />
                    {actionTextRevealer}
                </box>
            </box>
        </button>
    );
};

const NoResultButton = (): JSX.Element => (
    <SearchItem
        materialIconName={'Error'}
        name={'Search invalid'}
        content={'No results found!'}
        onActivate={() => {
            App.get_window('overview')?.set_visible(false);
        }}
    />
);

const CalculationResultButton = (result: string): JSX.Element => (
    <SearchItem
        materialIconName={'calculate'}
        name={'Math result'}
        actionName={'Copy'}
        content={result}
        onActivate={() => {
            App.get_window('overview')?.set_visible(false);
            execAsync(['wl-copy', result]).catch(print);
        }}
    />
);

const ExecuteCommandButton = (command: string, terminal: boolean = false): JSX.Element => (
    <SearchItem
        materialIconName={`${terminal ? 'terminal' : 'settings_b_roll'}`}
        name={'Run command'}
        actionName={`Execute ${terminal ? 'in terminal' : ''}`}
        content={command}
        onActivate={() => {
            App.get_window('overview')?.set_visible(false);
            if (terminal) {
                execAsync([`bash`, `-c`, `${options.terminal} -C "${command}"`, `&`]).catch(print);
            } else {
                execAsync(command).catch(print);
            }
        }}
        extraClassName={'techfont'}
    />
);

const CustomCommandButton = (text: string): JSX.Element => (
    <SearchItem
        materialIconName={'settings_suggest'}
        name={'Action'}
        actionName={'Run'}
        content={text}
        onActivate={() => {
            App.get_window('overview')?.set_visible(false);
            launchCustomCommand(text);
        }}
    />
);

const SearchButton = (text: string): JSX.Element => (
    <SearchItem
        materialIconName={'travel_explore'}
        name={'Search the web'}
        actionName={'Go'}
        content={text}
        onActivate={() => {
            App.get_window('overview')?.set_visible(false);
            execAsync(['bash', '-c', `xdg-open '${SEARCH_ENGINE}${text}' &`]).catch(print);
        }}
    />
);

const DirectoryButton = ({ parentPath, name, icon }: lsItem): JSX.Element => {
    const actionText = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={DURATION}
        >
            <label className={'overview-search-results-txt'} label={'Open'} />
        </revealer>
    ) as Widget.Revealer;

    const actionTextRevealer = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            transitionDuration={DURATION_S}
        >
            {actionText}
        </revealer>
    ) as Widget.Revealer;

    return (
        <button
            className={'overview-search-result-btn'}
            onClicked={() => {
                App.get_window('overview')?.set_visible(false);
                execAsync(['bash', '-c', `xdg-open '${parentPath}/${name}'`, `&`]).catch(print);
            }}
            setup={(self) => {
                self.connect('focus-in-event', () => {
                    actionText.set_reveal_child(true);
                    actionTextRevealer.set_reveal_child(true);
                });
                self.connect('focus-out-event', () => {
                    actionText.set_reveal_child(false);
                    actionTextRevealer.set_reveal_child(false);
                });
            }}
        >
            <box>
                <box vertical={false}>
                    <box className={'overview-search-results-icon'} homogeneous={true}>
                        <icon gIcon={icon} />
                    </box>
                    <label className={'overview-search-results-txt'} label={name} />
                    <box hexpand={true} />
                    {actionTextRevealer}
                </box>
            </box>
        </button>
    );
};

const DesktopEntryButton = (app: Apps.Application): JSX.Element => {
    const actionText = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={DURATION}
        >
            <label className={'overview-search-results-txt'} label={'Launch'} />
        </revealer>
    ) as Widget.Revealer;

    const actionTextRevealer = (
        <revealer
            revealChild={false}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            transitionDuration={DURATION_S}
        >
            {actionText}
        </revealer>
    ) as Widget.Revealer;

    return (
        <button
            className={'overview-search-result-btn'}
            onClicked={() => {
                App.get_window('overview')?.set_visible(false);
                app.launch();
            }}
            setup={(self) => {
                self.connect('focus-in-event', () => {
                    actionText.set_reveal_child(true);
                    actionTextRevealer.set_reveal_child(true);
                });
                self.connect('focus-out-event', () => {
                    actionText.set_reveal_child(false);
                    actionTextRevealer.set_reveal_child(false);
                });
            }}
        >
            <box>
                <box vertical={false}>
                    <box className={'overview-search-results-icon'} homogeneous={true}>
                        <icon icon={app.iconName} />
                        <label className={'overview-search-results-txt'} label={app.name} />
                        <box hexpand={true} />
                        {actionTextRevealer}
                    </box>
                </box>
            </box>
        </button>
    );
};

const Overview = (): JSX.Element => {
    const entryPromptRevealer = (
        <revealer
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={DURATION}
            revealChild={true}
            halign={Gtk.Align.CENTER}
        >
            <label className={'overview-search-prompt'} label={'Type to search'} />
        </revealer>
    ) as Widget.Revealer;

    const entryIconRevealer = (
        <revealer
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={DURATION}
            revealChild={false}
            halign={Gtk.Align.END}
        >
            <label className={'overview-search-icon'} label={'search'} />
        </revealer>
    ) as Widget.Revealer;

    const entryIcon = (
        <box
            className={'overview-search-prompt-box'}
            setup={(box) => {
                box.pack_start(entryIconRevealer, true, true, 0);
            }}
        />
    );

    const resultsBox = (<box className={'overview-search-results'} vertical={true} />) as Widget.Box;
    const resultsRevealer = (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transitionDuration={DURATION}
            halign={Gtk.Align.CENTER}
            revealChild={false}
        >
            {resultsBox}
        </revealer>
    ) as Widget.Revealer;

    const entry = (
        <entry
            className={'overview-search-box'}
            halign={Gtk.Align.CENTER}
            onActivate={() => {
                (resultsBox.children[0] as Widget.Button).clicked();
            }}
            onChanged={(entry) => {
                const text = entry.text;

                // check empty if so then don't do stuff
                if (text == '') {
                    resultsRevealer.set_reveal_child(false);
                    //overviewContent.revealChild = true;
                    entryPromptRevealer.set_reveal_child(true);
                    entryIconRevealer.set_reveal_child(false);
                    entry.toggleClassName('overview-search-box-extended', false);
                    return;
                }

                // this is when you type
                const isAction = text[0] == '>';
                const isDir = ['/', '~'].includes(text[0]);

                resultsBox.get_children().forEach((ch) => ch.destroy());

                resultsRevealer.set_reveal_child(true);
                //overviewContent.revealChild = false;
                entryPromptRevealer.set_reveal_child(false);
                entryIconRevealer.set_reveal_child(true);
                entry.toggleClassName('overview-search-box-extended', true);

                // Calculate
                if (ALLOWMATH && couldBeMath(text)) {
                    // Eval on typing is dangerous; this is a small workaround.
                    try {
                        const fullResult = eval(text.replace(/\^/g, '**')).toString();
                        resultsBox.add(CalculationResultButton(fullResult));
                    } catch (e) {
                        console.error(`Failed to calculate "${text}" for 'overview'.`, e);
                    }
                }
                if (ALLOWSEARCH && isDir) {
                    ls({ path: text, silent: true }).forEach((item) => {
                        resultsBox.add(DirectoryButton(item));
                    });
                }
                if (ALLOWACTION && isAction) {
                    // Eval on typing is dangerous, this is a workaround.
                    resultsBox.add(CustomCommandButton(text));
                }
                // Add application entries
                appSearch
                    .fuzzy_query(text)
                    .slice(0, MAX_RESULTS)
                    .forEach((app) => {
                        resultsBox.add(DesktopEntryButton(app));
                    });

                // Fallbacks
                // if the first word is an actual command
                if (ALLOWCOMMAND && !isAction && !hasUnterminatedBackslash(text) && isCommand(text)) {
                    resultsBox.add(ExecuteCommandButton(text, entry.text.startsWith('sudo')));
                }

                // Add fallback: search
                if (ALLOWWEBSEARCH) resultsBox.add(SearchButton(text));
                if (resultsBox.children.length == 0) resultsBox.add(NoResultButton());
                resultsBox.show_all();
            }}
        />
    );

    entry.connect('realize', () => {
        entry.grab_focus();

        const toplevel = entry.get_toplevel();
        if (toplevel && toplevel.is_toplevel()) {
            toplevel.connect('show', () => {
                entry.grab_focus();
            });
        }
    });

    return (
        <box vertical={true}>
            <box halign={Gtk.Align.CENTER}>
                {entry}
                <box
                    className={'overview-search-icon-box'}
                    setup={(box) => {
                        box.pack_start(entryPromptRevealer, true, true, 0);
                    }}
                />
                {entryIcon}
            </box>
            {/*overviewContent*/}
            {resultsRevealer}
        </box>
    );
};

function couldBeMath(str: string): boolean {
    const regex = /^[0-9.+*/-]/;
    return regex.test(str);
}

function expandTilde(path: string): string {
    if (path.startsWith('~')) {
        return GLib.get_home_dir() + path.slice(1);
    } else {
        return path;
    }
}

function getFileIcon(fileInfo: Gio.FileInfo): Gio.Icon {
    const icon = fileInfo.get_icon();

    return icon ? icon : Gio.icon_new_for_string('text-x-generic');
}

function ls({ path = '~', silent = false }): lsItem[] {
    const contents: lsItem[] = [];

    try {
        let expandedPath = expandTilde(path);

        if (expandedPath.endsWith('/')) {
            expandedPath = expandedPath.slice(0, -1);
        }

        const folder = Gio.File.new_for_path(expandedPath);

        const enumerator = folder.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
        let fileInfo: Gio.FileInfo | null;
        while ((fileInfo = enumerator.next_file(null)) !== null) {
            const fileName = fileInfo.get_display_name();
            const fileType = fileInfo.get_file_type();

            const item = {
                parentPath: expandedPath,
                name: fileName,
                type: fileType === Gio.FileType.DIRECTORY ? 'folder' : 'file',
                icon: getFileIcon(fileInfo),
            };
            // Add file extension for files
            if (fileType === Gio.FileType.REGULAR) {
                const fileExtension = fileName.split('.').pop();
                item.type = `${fileExtension}`;
            }

            contents.push(item);
            contents.sort((a, b) => {
                const aIsFolder = a.type.startsWith('folder');
                const bIsFolder = b.type.startsWith('folder');
                if (aIsFolder && !bIsFolder) {
                    return -1;
                } else if (!aIsFolder && bIsFolder) {
                    return 1;
                } else {
                    return a.name.localeCompare(b.name); // Sort alphabetically within folders and files
                }
            });
        }
    } catch (e) {
        if (!silent) console.log(e);
    }
    return contents;
}

function hasUnterminatedBackslash(inputString: string): boolean {
    // Use a regular expression to match a trailing odd number of backslashes
    const regex = /\\+$/;
    return regex.test(inputString);
}

function launchCustomCommand(command: string): void {
    const args = command.toLowerCase().split(' ');

    switch (args[0]) {
        case '>raw': // Mouse raw input
            execAsync('hyprctl -j getoption input:accel_profile').then((output) => {
                const value = JSON.parse(output)['str'].trim();
                if (value != '[[EMPTY]]' && value != '') {
                    execAsync(['bash', '-c', `hyprctl keyword input:accel_profile '[[EMPTY]]'`]).catch(print);
                } else {
                    execAsync(['bash', '-c', `hyprctl keyword input:accel_profile flat`]).catch(print);
                }
            });
            break;
        case '>img': // Change wallpaper
            //execAsync([`bash`, `-c`, `${App.configDir}/scripts/color_generation/switchwall.sh`, `&`]).catch(print);
            break;
        case '>color': // Generate colorscheme from color picker
            if (!args[1]) {
            }
            //execAsync([`bash`, `-c`, `${App.configDir}/scripts/color_generation/switchcolor.sh --pick`, `&`]).catch(
            //    print,
            //);
            else if (args[1][0] === '#') {
            }
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `${App.configDir}/scripts/color_generation/switchcolor.sh "${args[1]}"`,
            //     `&`,
            // ]).catch(print);
            break;
        case '>light': // Light mode
            //darkMode.value = false;
            break;
        case '>dark': // Dark mode
            //darkMode.value = true;
            break;
        case '>badapple': // Black and white
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `mkdir -p ${GLib.get_user_state_dir()}/ags/user && sed -i "3s/.*/monochrome/" ${GLib.get_user_state_dir()}/ags/user/colormode.txt`,
            // ])
            //     .then(execAsync(['bash', '-c', `${App.configDir}/scripts/color_generation/switchcolor.sh`]))
            //     .catch(print);
            break;
        case '>adw':
        case '>adwaita':
            //const ADWAITA_BLUE = '#3584E4';
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `${App.configDir}/scripts/color_generation/switchcolor.sh "${ADWAITA_BLUE}" --no-gradience`,
            //     `&`,
            // ]).catch(print);
            break;
        case '>grad':
        case '>gradience':
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `${App.configDir}/scripts/color_generation/switchcolor.sh - --yes-gradience`,
            //     `&`,
            // ]).catch(print);
            break;
        case '>nograd':
        case '>nogradience':
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `${App.configDir}/scripts/color_generation/switchcolor.sh - --no-gradience`,
            //     `&`,
            // ]).catch(print);
            break;
        case '>material': // Use material colors
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `mkdir -p ${GLib.get_user_state_dir()}/ags/user && echo "material" > ${GLib.get_user_state_dir()}/ags/user/colorbackend.txt`,
            // ])
            //     .catch(print)
            //     .then(
            //         execAsync([
            //             'bash',
            //             '-c',
            //             `${App.configDir}/scripts/color_generation/switchwall.sh --noswitch`,
            //         ]).catch(print),
            //     )
            //     .catch(print);
            break;
        case '>pywal': // Use Pywal (ik it looks shit but I'm not removing)
            // execAsync([
            //     `bash`,
            //     `-c`,
            //     `mkdir -p ${GLib.get_user_state_dir()}/ags/user && echo "pywal" > ${GLib.get_user_state_dir()}/ags/user/colorbackend.txt`,
            // ])
            //     .catch(print)
            //     .then(
            //         execAsync([
            //             'bash',
            //             '-c',
            //             `${App.configDir}/scripts/color_generation/switchwall.sh --noswitch`,
            //         ]).catch(print),
            //     )
            //     .catch(print);
            break;
        case '>todo': // Todo
            //Todo.add(args.slice(1).join(' '));
            break;
        case '>shutdown': // Shut down
            execAsync([`bash`, `-c`, `systemctl poweroff`]).catch(print);
            break;
        case '>reboot': // Reboot
            execAsync([`bash`, `-c`, `systemctl reboot`]).catch(print);
            break;
        case '>sleep': // Sleep
            execAsync([`bash`, `-c`, `systemctl suspend`]).catch(print);
            break;
        case '>logout': // Log out
            execAsync([`bash`, `-c`, `pkill Hyprland || pkill sway`]).catch(print);
            break;
    }
}

function isCommand(command: string): boolean {
    try {
        const executable = command.split(' ')[0];
        if (executable === ' ') return false;

        return exec(`bash -c "command -v ${executable}"`) != '';
    } catch {
        return false;
    }
}

interface lsItem {
    parentPath: string;
    name: string;
    type: string;
    icon: Gio.Icon;
}

interface SearchItemProps {
    materialIconName: string;
    name: string;
    actionName?: string;
    content: string;
    onActivate: () => void;
    extraClassName?: string;
}

export default (): JSX.Element => (
    <PopupWindow name={`overview`}>
        <Overview />
    </PopupWindow>
);
