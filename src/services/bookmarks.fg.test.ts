import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import * as Tabs from 'src/services/tabs.fg'
import * as Bookmarks from 'src/services/bookmarks.fg'
import * as Settings from 'src/services/settings'
import * as Sidebar from 'src/services/sidebar.fg'
import * as Utils from 'src/utils'
import { MTab } from 'src/defaults/mocks'
import { TABS_PANEL_STATE } from 'src/defaults'
import { PanelType } from 'src/enums'

describe('Bookmarks.getMouseOpeningConf()', () => {
  beforeEach(() => {
    Sidebar.setReadyState(true)
    Sidebar.setActivePanelId('a')
    Sidebar.setNav(['a'])
    Sidebar.setPanelsById({
      a: { ...Utils.clone(TABS_PANEL_STATE), id: 'a' },
    })
    Sidebar.setPanels(Sidebar.nav.map(id => Sidebar.panelsById[id]))
    Sidebar.setHasPanelTypeState(PanelType.tabs, true)
  })

  afterEach(() => {
    Settings.resetSettings()
    Tabs.setList([])
    Tabs.setById({})
  })

  test('new tab pos: left click: fallback to general settings', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.moveNewTab = 'after'
    Settings.state.bookmarksLeftClickAction = 'open_in_new'
    Settings.state.bookmarksLeftClickPos = 'default'

    const conf = Bookmarks.getMouseOpeningConf(0)
    expect(conf.dst.index).toBe(2)
    expect(conf.dst.parentId).toBe(2)
  })

  test('new tab pos: left click: fallback to general settings 2', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.moveNewTab = 'end'
    Settings.state.bookmarksLeftClickAction = 'open_in_new'
    Settings.state.bookmarksLeftClickPos = 'default'

    const conf = Bookmarks.getMouseOpeningConf(0)
    expect(conf.dst.index).toBe(3)
    expect(conf.dst.parentId).toBeUndefined()
  })

  test('new tab pos: left click: after', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.bookmarksLeftClickAction = 'open_in_new'
    Settings.state.bookmarksLeftClickPos = 'after'

    const conf = Bookmarks.getMouseOpeningConf(0)
    expect(conf.dst.index).toBe(2)
    expect(conf.dst.parentId).toBe(2)
  })

  test('new tab pos: middle click: fallback to general settings', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.moveNewTab = 'after'
    Settings.state.bookmarksMidClickAction = 'open_in_new'
    Settings.state.bookmarksMidClickPos = 'default'

    const conf = Bookmarks.getMouseOpeningConf(1)
    expect(conf.dst.index).toBe(2)
    expect(conf.dst.parentId).toBe(2)
  })

  test('new tab pos: middle click: fallback to general settings 2', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.moveNewTab = 'end'
    Settings.state.bookmarksMidClickAction = 'open_in_new'
    Settings.state.bookmarksMidClickPos = 'default'

    const conf = Bookmarks.getMouseOpeningConf(1)
    expect(conf.dst.index).toBe(3)
    expect(conf.dst.parentId).toBeUndefined()
  })

  test('new tab pos: middle click: after', () => {
    Tabs.setList([
      new MTab({ id: 2, index: 0, panelId: 'a', isParent: true }),
      new MTab({ id: 3, index: 1, panelId: 'a', parentId: 2, lvl: 1, active: true }),
      new MTab({ id: 4, index: 2, panelId: 'a', parentId: 2, lvl: 1 }),
    ])
    Tabs.list.forEach(t => (Tabs.byId[t.id] = t))
    Tabs.setActiveId(3)

    Settings.state.bookmarksMidClickAction = 'open_in_new'
    Settings.state.bookmarksMidClickPos = 'after'

    const conf = Bookmarks.getMouseOpeningConf(1)
    expect(conf.dst.index).toBe(2)
    expect(conf.dst.parentId).toBe(2)
  })
})
