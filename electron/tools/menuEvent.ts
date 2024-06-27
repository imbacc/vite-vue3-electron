import type { BrowserWindow } from 'electron'

import process from 'node:process'
import { Menu } from 'electron'

export default (win: BrowserWindow) => {
  Menu.setApplicationMenu(null)

  const template: any = [
    {
      label: '版本',
      submenu: [
        {
          label: `chrome v${process.versions.chrome}`,
        },
        {
          label: `node v${process.versions.node}`,
        },
        {
          label: `electron v${process.versions.electron}`,
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
