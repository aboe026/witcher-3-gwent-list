import fs from 'fs/promises'
import path from 'path'
import XLSX from 'xlsx'

import env from './env'

//
;(async () => {
  try {
    const spreadSheetPath = env.SPREADSHEET_PATH
    if (!(await fileExists(spreadSheetPath))) {
      throw Error(`Gwent card spreadsheet "${spreadSheetPath}" does not exist or is not accessible.`)
    }
    if (!(await pathExists(env.OUTPUT_DIRECTORY))) {
      await fs.mkdir(env.OUTPUT_DIRECTORY)
    }

    // verify spreadsheet
    const workbook = await XLSX.readFile(spreadSheetPath)
    for (const sheetName in SHEET_NAMES) {
      if (!workbook.SheetNames.includes(sheetName)) {
        throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${sheetName}"`)
      }
    }

    // convert XSLX to JSON
    const unitsSheet = workbook.Sheets[SHEET_NAMES.Units]
    const unitsJson = XLSX.utils.sheet_to_json(unitsSheet)
    const leadersSheet = workbook.Sheets[SHEET_NAMES.Leaders]
    const leadersJson = XLSX.utils.sheet_to_json(leadersSheet)
    const factionsSheet = workbook.Sheets[SHEET_NAMES.Factions]
    const factionsJson = XLSX.utils.sheet_to_json(factionsSheet)
    const effectsSheet = workbook.Sheets[SHEET_NAMES.Effects]
    const effectsJson = XLSX.utils.sheet_to_json(effectsSheet)

    // write JSON to file
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'units.json'), unitsJson)
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'leaders.json'), leadersJson)
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'factions.json'), factionsJson)
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'effects.json'), effectsJson)
  } catch (err: unknown) {
    console.error(err)
    process.exit(1)
  }
})()

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
  } catch (err: unknown) {
    return false
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function replaceFile(path: string, data: any[]) {
  if (await fileExists(path)) {
    await fs.rm(path)
  }
  await fs.writeFile(path, JSON.stringify(data, null, 2))
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch (err: unknown) {
    return false
  }
}

enum SHEET_NAMES {
  Units = 'Units',
  Leaders = 'Leaders',
  Effects = 'Effects',
  Factions = 'Factions',
  Types = 'Types',
}
