import { DEFAULT_CONTAINER_ID } from 'src/defaults'
import { translate } from 'src/dict'
import * as Containers from 'src/services/containers'
import * as Logs from 'src/services/logs'
import * as Utils from 'src/utils'
import * as Tabs from 'src/services/tabs.bg'
import * as WebReq from 'src/services/web-req.bg'

const enum OmniCmdType {
  ReopenInContainer = 1,
}

interface OmniCmd {
  type: OmniCmdType
  name: string
  value: string
  searchValue: string
  containerId?: string
}

let commands: OmniCmd[] = []
let filtered: Readonly<OmniCmd[]> | null = null

export function load() {
  updateCommands()

  browser.omnibox.setDefaultSuggestion({
    description: translate('omnibox.default_suggestion'),
  })
}

function updateCommands() {
  commands = []

  // Reopen in container
  const defaultCtrName = translate('omnibox.reopen_in_ctr.default_ctr_name')
  commands.push({
    type: OmniCmdType.ReopenInContainer,
    name: translate('omnibox.reopen_in_ctr', defaultCtrName),
    value: `${defaultCtrName} (id: ${DEFAULT_CONTAINER_ID})`,
    searchValue: defaultCtrName.toLowerCase(),
    containerId: DEFAULT_CONTAINER_ID,
  })
  for (const container of Object.values(Containers.reactive.byId)) {
    commands.push({
      type: OmniCmdType.ReopenInContainer,
      name: translate('omnibox.reopen_in_ctr', container.name),
      value: `${container.name} (id: ${container.id})`,
      searchValue: container.name.toLowerCase(),
      containerId: container.id,
    })
  }
}
export const updateCommandsDebounced = Utils.debounce(updateCommands)

function filterCmds(input: string): Readonly<OmniCmd[]> {
  if (!input) return []

  const activeTab = Tabs.getActiveTabInLastFocusedWindow()
  if (!activeTab) {
    Logs.warn('Omnibox.filterCmds: Cannot find active tab')
    return []
  }

  const lowerCaseInput = input.toLowerCase()
  const filtered: OmniCmd[] = []

  for (const cmd of commands) {
    // Reopen in container
    if (cmd.type === OmniCmdType.ReopenInContainer && cmd.containerId !== undefined) {
      if (activeTab.incognito) continue
      if (activeTab.cookieStoreId === cmd.containerId) continue
      if (cmd.searchValue.includes(lowerCaseInput)) filtered.push(cmd)
    }
  }

  return filtered
}

async function runCmd(cmd: OmniCmd) {
  // Reopen in container
  if (cmd.type === OmniCmdType.ReopenInContainer && cmd.containerId !== undefined) {
    const activeTab = Tabs.getActiveTabInLastFocusedWindow()
    if (!activeTab) return Logs.warn('Omnibox.runCmd: Cannot find active tab')

    WebReq.disableAutoReopening(cmd.containerId, 1000)

    try {
      await Tabs.reopenTab(activeTab, activeTab.url, cmd.containerId)
    } catch {
      Logs.warn('Omnibox.runCmd: failed to re-open tab', activeTab.id, cmd.containerId)
    }
  }
}

function onInputChanged(input: string, suggest: (s: browser.omnibox.SuggestResult[]) => void) {
  filtered = filterCmds(input)
  const suggestions = filtered.map(cmd => ({
    content: cmd.value,
    description: cmd.name,
    deletable: false,
  }))
  suggest(suggestions)
}

async function onInputEntered(input: string, newTabPos: browser.omnibox.OnInputEnteredDisposition) {
  if (!filtered?.length) return

  let targetCmd = filtered.find(cmd => cmd.value === input)
  if (!targetCmd) targetCmd = filtered[0]
  if (!targetCmd) return

  runCmd(targetCmd)
}

export function setupListeners() {
  browser.omnibox.onInputChanged.addListener(onInputChanged)
  browser.omnibox.onInputEntered.addListener(onInputEntered)
}
