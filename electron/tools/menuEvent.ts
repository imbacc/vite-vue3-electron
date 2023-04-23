import { Menu } from 'electron'

export default (win) => {
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