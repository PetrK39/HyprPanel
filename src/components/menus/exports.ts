import AudioMenu from './audio/index.js';
import NetworkMenu from './network/index.js';
import BluetoothMenu from './bluetooth/index.js';
import MediaMenu from './media/index.js';
import NotificationsMenu from './notifications/index.js';
import CalendarMenu from './calendar/index.js';
import EnergyMenu from './energy/index.js';
import DashboardMenu from './dashboard/index.js';
import SessionMenu from './session/index.js';
import OverviewMenu from './overview/index.js';
import ThemesMenu from './theme';

export const DropdownMenus = [
    AudioMenu,
    NetworkMenu,
    BluetoothMenu,
    MediaMenu,
    NotificationsMenu,
    CalendarMenu,
    EnergyMenu,
    DashboardMenu,
    ThemesMenu,
];

export const StandardWindows = [SessionMenu, OverviewMenu];
