// import { setupCursorHoverGrab } from '../.widgetutils/cursorhover.js';
// import { dumpToWorkspace, swapWorkspace } from './actions.js';
// import { iconExists, substitute } from '../.miscutils/icons.js';
// import { monitors } from '../.commondata/hyprlanddata.js';
// import { MaterialIcon } from '../.commonwidgets/materialicon.js';
// import { App, Astal, Gdk, Gtk, Widget } from 'astal/gtk3';
// import { Variable } from 'astal';
// import { hyprlandService } from 'src/lib/constants/services';
//
// type MonitorMap = Record<number, { x: number; y: number }>;
//
// const DURATION = 500;
// const NUM_OF_COLS = 4;
// const NUM_OF_ROWS = 2;
// const SCALE = 50;
//
// const NUM_OF_WORKSPACES_SHOWN = NUM_OF_COLS * NUM_OF_ROWS;
// const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];
//
// const overviewTick = Variable(false);
//
// export default (overviewMonitor = 0) => {
//     const clientMap = new Map();
//     const ContextMenuWorkspaceArray = ({ label, actionFunc, thisWorkspace }) =>
//         Widget.MenuItem({
//             label: `${label}`,
//             setup: (menuItem) => {
//                 let submenu = new Gtk.Menu();
//                 submenu.className = 'menu';
//
//                 const offset =
//                     Math.floor((Hyprland.active.workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) * NUM_OF_WORKSPACES_SHOWN;
//                 const startWorkspace = offset + 1;
//                 const endWorkspace = startWorkspace + NUM_OF_WORKSPACES_SHOWN - 1;
//                 for (let i = startWorkspace; i <= endWorkspace; i++) {
//                     let button = new Gtk.MenuItem({
//                         label: `Workspace ${i}`,
//                     });
//                     button.connect('activate', () => {
//                         // execAsync([`${onClickBinary}`, `${thisWorkspace}`, `${i}`]).catch(print);
//                         actionFunc(thisWorkspace, i);
//                         overviewTick.setValue(!overviewTick.value);
//                     });
//                     submenu.append(button);
//                 }
//                 menuItem.set_reserve_indicator(true);
//                 menuItem.set_submenu(submenu);
//             },
//         });
//
//     const Window = (
//         {
//             address,
//             at: { x, y },
//             size: { w, h },
//             workspace: { id, name },
//             class: c,
//             initialClass,
//             monitor,
//             title,
//             xwayland,
//         }: WindowProps,
//         screenCoords: { x: number; y: number },
//     ) => {
//         const revealInfoCondition = Math.min(w, h) * SCALE > 70;
//         if (w <= 0 || h <= 0 || (c === '' && title === '')) return null;
//         // Non-primary monitors
//         if (screenCoords.x != 0) x -= screenCoords.x;
//         if (screenCoords.y != 0) y -= screenCoords.y;
//         // Other offscreen adjustments
//         if (x + w <= 0) x += Math.floor(x / monitors[monitor].width) * monitors[monitor].width;
//         else if (x < 0) {
//             w = x + w;
//             x = 0;
//         }
//         if (y + h <= 0) x += Math.floor(y / monitors[monitor].height) * monitors[monitor].height;
//         else if (y < 0) {
//             h = y + h;
//             y = 0;
//         }
//         // Truncate if offscreen
//         if (x + w > monitors[monitor].width) w = monitors[monitor].width - x;
//         if (y + h > monitors[monitor].height) h = monitors[monitor].height - y;
//
//         if (c.length == 0) c = initialClass;
//         const iconName = substitute(c);
//         const appIcon = iconExists(iconName)
//             ? Widget.Icon({
//                   icon: iconName,
//                   size: (Math.min(w, h) * SCALE) / 2.5,
//               })
//             : MaterialIcon('terminal', 'gigantic', {
//                   css: `font-size: ${(Math.min(w, h) * SCALE) / 2.5}px`,
//               });
//         return Widget.Button({
//             attribute: {
//                 address,
//                 x,
//                 y,
//                 w,
//                 h,
//                 ws: id,
//                 updateIconSize: (self) => {
//                     appIcon.size = (Math.min(self.attribute.w, self.attribute.h) * SCALE) / 2.5;
//                 },
//             },
//             className: 'overview-tasks-window',
//             hpack: 'start',
//             vpack: 'start',
//             css: `
//                 margin-left: ${Math.round(x * SCALE)}px;
//                 margin-top: ${Math.round(y * SCALE)}px;
//                 margin-right: -${Math.round((x + w) * SCALE)}px;
//                 margin-bottom: -${Math.round((y + h) * SCALE)}px;
//             `,
//             onClicked: (self) => {
//                 Hyprland.messageAsync(`dispatch focuswindow address:${address}`);
//                 App.closeWindow('overview');
//             },
//             onMiddleClickRelease: () => Hyprland.messageAsync(`dispatch closewindow address:${address}`),
//             onSecondaryClick: (button) => {
//                 button.toggleClassName('overview-tasks-window-selected', true);
//                 const menu = Widget.Menu({
//                     className: 'menu',
//                     children: [
//                         Widget.MenuItem({
//                             child: Widget.Label({
//                                 xalign: 0,
//                                 label: 'Close (Middle-click)',
//                             }),
//                             onActivate: () => Hyprland.messageAsync(`dispatch closewindow address:${address}`),
//                         }),
//                         ContextMenuWorkspaceArray({
//                             label: 'Dump windows to workspace',
//                             actionFunc: dumpToWorkspace,
//                             thisWorkspace: Number(id),
//                         }),
//                         ContextMenuWorkspaceArray({
//                             label: 'Swap windows with workspace',
//                             actionFunc: swapWorkspace,
//                             thisWorkspace: Number(id),
//                         }),
//                     ],
//                 });
//                 menu.connect('deactivate', () => {
//                     button.toggleClassName('overview-tasks-window-selected', false);
//                 });
//                 menu.connect('selection-done', () => {
//                     button.toggleClassName('overview-tasks-window-selected', false);
//                 });
//                 menu.popup_at_widget(button.get_parent(), Gravity.SOUTH, Gravity.NORTH, null); // Show menu below the button
//                 button.connect('destroy', () => menu.destroy());
//             },
//             child: Widget.Box({
//                 homogeneous: true,
//                 child: Widget.Box({
//                     vertical: true,
//                     vpack: 'center',
//                     children: [
//                         appIcon,
//                         // TODO: Add xwayland tag instead of just having italics
//                         Widget.Revealer({
//                             transition: 'slide_right',
//                             revealChild: revealInfoCondition,
//                             child: Widget.Revealer({
//                                 transition: 'slide_down',
//                                 revealChild: revealInfoCondition,
//                                 child: Widget.Label({
//                                     maxWidthChars: 1, // Doesn't matter what number
//                                     truncate: 'end',
//                                     className: `margin-top-5 ${xwayland ? 'txt txt-italic' : 'txt'}`,
//                                     css: `
//                                 font-size: ${(Math.min(monitors[monitor].width, monitors[monitor].height) * SCALE) / 14.6}px;
//                                 margin: 0px ${(Math.min(monitors[monitor].width, monitors[monitor].height) * SCALE) / 10}px;
//                             `,
//                                     // If the title is too short, include the class
//                                     label: title.length <= 1 ? `${c}: ${title}` : title,
//                                 }),
//                             }),
//                         }),
//                     ],
//                 }),
//             }),
//             tooltipText: `${c}: ${title}`,
//             setup: (button) => {
//                 setupCursorHoverGrab(button);
//
//                 button.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.MOVE);
//                 button.drag_source_set_icon_name(substitute(c));
//
//                 button.connect('drag-begin', (button) => {
//                     // On drag start, add the dragging class
//                     button.toggleClassName('overview-tasks-window-dragging', true);
//                 });
//                 button.connect('drag-data-get', (_w, _c, data) => {
//                     // On drag finish, give address
//                     data.set_text(address, address.length);
//                     button.toggleClassName('overview-tasks-window-dragging', false);
//                 });
//             },
//         });
//     };
//
//     // WEIRD METHODS GOES HERE?
//
//     const Workspace = (index) => {
//
//         const fixed = new Widget.Box({
//             attribute: {
//                 put: (widget, x, y) => {
//                     if (!widget.attribute) return;
//                     // Note: x and y are already multiplied by userOptions.overview.scale
//                 },
//                 move: (widget, x, y) => {
//                     if (!widget) return;
//                     if (!widget.attribute) return;
//                     // Note: x and y are already multiplied by userOptions.overview.scale
//                     const newCss = `
//                         margin-left: ${Math.round(x)}px;
//                         margin-top: ${Math.round(y)}px;
//                         margin-right: -${Math.round(x + widget.attribute.w * SCALE)}px;
//                         margin-bottom: -${Math.round(y + widget.attribute.h * SCALE)}px;
//                     `;
//                     widget.css = newCss;
//                 },
//             },
//         });
//
//         const WorkspaceNumber = ({ index, valign, halign }: WorkspaceNumberProps): JSX.Element => (
//             <label
//                 className={'overview-tasks-workspace-number'}
//                 label={index.toString()}
//                 valign={valign}
//                 halign={halign}
//                 css={
//                     `margin: ${Math.min(monitors[overviewMonitor].width, monitors[overviewMonitor].height)} * ${SCALE}` +
//                     ` * ${userOptions.overview.wsNumMarginScale}px;
//                     font-size: ${monitors[overviewMonitor].height} * ${SCALE}` +
//                     ` *${userOptions.overview.wsNumScale}px;`
//                 }
//                 setup={(self) => {
//                     self.hook(hyprlandService, 'focused-workspace-changed', () => {
//                         const currentGroup = Math.floor(
//                             (hyprlandService.focusedWorkspace.id - 1) / NUM_OF_WORKSPACES_SHOWN,
//                         );
//                         self.label = `${currentGroup * NUM_OF_WORKSPACES_SHOWN + index}`;
//                     });
//                 }}
//             />
//         );
//
//         const widget = (
//             <box
//                 className={'overview-tasks-workspace'}
//                 valign={Gtk.Align.CENTER}
//                 css={`
//                     min-width: ${1 + Math.round(monitors[overviewMonitor].width * SCALE)}px;
//                     min-height: ${1 + Math.round(monitors[overviewMonitor].height * SCALE)}px;
//                 `}
//             >
//                 <eventbox
//                     hexpand={true}
//                     onClick={(_, e) => {
//                         if (e.button != Astal.MouseButton.PRIMARY) return;
//
//                         hyprlandService.dispatch('workspace', index);
//                         App.get_window('overview')?.close();
//                     }}
//                     setup={(self) => {
//                         self.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
//                         self.connect('drag-data-received', (_w, _c, _x, _y, data) => {
//                             const offset =
//                                 Math.floor((hyprlandService.focusedWorkspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) *
//                                 NUM_OF_WORKSPACES_SHOWN;
//
//                             hyprlandService.dispatch(
//                                 'movetoworkspacesilent',
//                                 `${index + offset},address:${data.get_text()}`,
//                             );
//
//                             overviewTick.set(!overviewTick.get());
//                         });
//                     }}
//                 >
//                     <overlay
//                         overlays={[
//                             WorkspaceNumber({ index: index, halign: Gtk.Align.START, valign: Gtk.Align.START }),
//                             fixed,
//                         ]}
//                     >
//                         <box />
//                     </overlay>
//                 </eventbox>
//             </box>
//         );
//
//         const offset =
//             Math.floor((hyprlandService.focusedWorkspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) * NUM_OF_WORKSPACES_SHOWN;
//         fixed.attribute.put(WorkspaceNumber(offset + index), 0, 0);
//         widget.clear = () => {
//             const offset =
//                 Math.floor((hyprlandService.focusedWorkspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) *
//                 NUM_OF_WORKSPACES_SHOWN;
//             clientMap.forEach((client, address) => {
//                 if (!client) return;
//                 if (
//                     client.attribute.ws <= offset ||
//                     client.attribute.ws > offset + NUM_OF_WORKSPACES_SHOWN ||
//                     client.attribute.ws == offset + index
//                 ) {
//                     client.destroy();
//                     client = null;
//                     clientMap.delete(address);
//                 }
//             });
//         };
//         widget.set = (clientJson, screenCoords) => {
//             let c = clientMap.get(clientJson.address);
//             if (c) {
//                 if (c.attribute?.ws !== clientJson.workspace.id) {
//                     c.destroy();
//                     c = null;
//                     clientMap.delete(clientJson.address);
//                 } else if (c) {
//                     c.attribute.w = clientJson.size[0];
//                     c.attribute.h = clientJson.size[1];
//                     c.attribute.updateIconSize(c);
//                     fixed.attribute.move(
//                         c,
//                         Math.max(0, clientJson.at[0] * SCALE),
//                         Math.max(0, clientJson.at[1] * SCALE),
//                     );
//                     return;
//                 }
//             }
//             const newWindow = Window(clientJson, screenCoords);
//             if (newWindow === null) return;
//             // clientMap.set(clientJson.address, newWindow);
//             fixed.attribute.put(
//                 newWindow,
//                 Math.max(0, newWindow.attribute.x * SCALE),
//                 Math.max(0, newWindow.attribute.y * SCALE),
//             );
//             clientMap.set(clientJson.address, newWindow);
//         };
//         widget.unset = (clientAddress) => {
//             const offset =
//                 Math.floor((Hyprland.active.workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) * NUM_OF_WORKSPACES_SHOWN;
//             let c = clientMap.get(clientAddress);
//             if (!c) return;
//             c.destroy();
//             c = null;
//             clientMap.delete(clientAddress);
//         };
//         widget.show = () => {
//             fixed.show_all();
//         };
//         return widget;
//     };
//
//     const wArr = (s: number, n: number): number[] => {
//         const array: number[] = [];
//         for (let i = 0; i < n; i++) array.push(s + i);
//
//         return array;
//     };
//
//     const OverviewRow = ({ startWorkspace, workspaces, windowName = 'overview' }: OverviewRowProps): JSX.Element => {
//         let workspaceGroup = Math.floor((hyprlandService.focused_workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN);
//         let monitorMap: MonitorMap = {};
//         const getMonitorMap = (): void => {
//             hyprlandService.sync_monitors((hyprland, res) => {
//                 monitorMap =
//                     hyprland?.get_monitors().reduce((acc, item) => {
//                         acc[item.id] = { x: item.x, y: item.y };
//                         return acc;
//                     }, {} as MonitorMap) || {};
//                 hyprlandService.sync_monitors_finish(res);
//             });
//         };
//
//         const update = (box: Widget.Box): void => {
//             const offset =
//                 Math.floor((hyprlandService.focused_workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) *
//                 NUM_OF_WORKSPACES_SHOWN;
//             hyprlandService.sync_clients((hyprland, res) => {
//                 const kids = box.get_children();
//                 kids.forEach((kid) => kid.clear());
//
//                 if (!hyprland) {
//                     hyprlandService.sync_clients_finish(res);
//                     return;
//                 }
//
//                 for (let i = 0; i < hyprland.clients.length; i++) {
//                     const client = hyprland.clients[i];
//                     const childID = client.workspace.id - (offset + startWorkspace);
//                     if (
//                         offset + startWorkspace <= client.workspace.id &&
//                         client.workspace.id <= offset + startWorkspace + workspaces
//                     ) {
//                         const screenCoords = monitorMap[client.monitor.id];
//                         if (kids[childID]) {
//                             kids[childID].set(client, screenCoords);
//                         }
//                     }
//                 }
//                 kids.forEach((kid) => kid.show());
//                 hyprlandService.sync_clients_finish(res);
//             });
//         };
//
//         const updateWorkspace = (box: Widget.Box, id: number): void => {
//             const offset =
//                 Math.floor((hyprlandService.focused_workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) *
//                 NUM_OF_WORKSPACES_SHOWN;
//             if (!(offset + startWorkspace <= id && id <= offset + startWorkspace + workspaces))
//                 // Not in range, ignore
//                 return;
//
//             hyprlandService.sync_clients((hyprland, res) => {
//                 if (!hyprland) {
//                     hyprlandService.sync_clients_finish(res);
//                     return;
//                 }
//
//                 const kids = box.get_children();
//                 for (let i = 0; i < hyprland.clients.length; i++) {
//                     const client = hyprland.clients[i];
//                     if (client.workspace.id != id) continue;
//                     const screenCoords = monitorMap[client.monitor.id];
//                     kids[id - (offset + startWorkspace)]?.set(client, screenCoords);
//                 }
//                 kids[id - (offset + startWorkspace)]?.show();
//             });
//         };
//
//         return (
//             <box
//                 setup={(box) => {
//                     getMonitorMap();
//                     // update on tick
//                     box.hook(overviewTick, update);
//
//                     // updateWorkspace and unset row's kid on client remove
//                     hyprlandService.connect('client-removed', (_, addr) => {
//                         const offset =
//                             Math.floor((hyprlandService.focused_workspace.id - 1) / NUM_OF_WORKSPACES_SHOWN) *
//                             NUM_OF_WORKSPACES_SHOWN;
//                         const client = hyprlandService.get_client(addr);
//                         if (!client) return;
//
//                         updateWorkspace(box, client.workspace.id);
//                         box.get_children()[client.workspace.id - (offset + startWorkspace)]?.unset(addr);
//                     });
//
//                     // updateWorkspace on client add
//                     hyprlandService.connect('client-added', (_, client) => {
//                         updateWorkspace(box, client.workspace.id);
//                     });
//
//                     // update and set workspaceGroup on focused workspace change
//                     box.hook(hyprlandService, 'focused-workspace-changed', (_, args) => {
//                         console.log(args);
//                         const previousGroup = workspaceGroup;
//                         const currentGroup = Math.floor(
//                             (hyprlandService.focusedWorkspace.id - 1) / NUM_OF_WORKSPACES_SHOWN,
//                         );
//                         if (currentGroup !== previousGroup) {
//                             if (!App.get_window(windowName) || !App.get_window(windowName)?.visible) return;
//                             update(box);
//                             workspaceGroup = currentGroup;
//                         }
//                     });
//
//                     // update on show
//                     box.connect('realize', () => {
//                         const boxTopLevel = box.get_toplevel();
//                         boxTopLevel.connect('show', () => {
//                             if (boxTopLevel.visible) update(box);
//                         });
//                     });
//                 }}
//             >
//                 {wArr(startWorkspace, workspaces).map(Workspace)}
//             </box>
//         );
//     };
//
//     return (
//         <revealer
//             revealChild={true}
//             halign={Gtk.Align.CENTER}
//             transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
//             transitionDuration={DURATION}
//         >
//             <box vertical={true} className={'overview-tasks'}>
//                 {Array.from(
//                     { length: NUM_OF_ROWS },
//                     (_: unknown, index: number): JSX.Element => (
//                         <OverviewRow startWorkspace={1 + index * NUM_OF_COLS} workspaces={NUM_OF_COLS} />
//                     ),
//                 )}
//             </box>
//         </revealer>
//     );
// };
//
// interface WorkspaceNumberProps {
//     index: number;
//     valign?: Gtk.Align;
//     halign?: Gtk.Align;
// }
//
// interface WindowProps {
//     address: string;
//     at: { x: number; y: number };
//     size: { w: number; h: number };
//     workspace: { id: number; name: string };
//     class: string;
//     initialClass: string;
//     monitor: number;
//     title: string;
//     xwayland: boolean;
// }
//
// interface OverviewRowProps {
//     startWorkspace: number;
//     workspaces: number;
//     windowName?: string;
// }
