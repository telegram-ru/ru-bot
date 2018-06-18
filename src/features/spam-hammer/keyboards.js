const debug = require('debug')('rubot:features:spam-hammer:keyboards')
const Markup = require('telegraf/markup')
const text = require('../../text')
const { reconstructMarkdown } = require('../../lib/entities')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')


const actUnspamUser = 'unspam_user'
const actUnspamUserOk = 'unspam_user_ok'
const actUnspamUserNo = 'unspam_user_no'

function keyboardUnspamUser({ banned }) {
  return Markup.inlineKeyboard([
    Markup.callbackButton(text.spamHammer.actionUnspam(), `${actUnspamUser} ${banned.id}`),
  ])
}

function keyboardUnspamUserConfirm({ banned }) {
  return Markup.inlineKeyboard([
    Markup.callbackButton(text.spamHammer.actionUnspam(), `${actUnspamUserOk} ${banned.id}`),
    Markup.callbackButton(text.common.actionCancel(), `${actUnspamUserNo} ${banned.id}`),
  ])
}

/**
 * Show confirmation to unspam user
 */
function handleUnspamUser({ match, editMessageReplyMarkup }) {
  const [, targetId] = match

  debug('handleUnspamUser', targetId)
  editMessageReplyMarkup(keyboardUnspamUserConfirm({ banned: { id: targetId } }))
}

/**
 * Restore Unban button
 */
function handleUnspamUserNo({ match, editMessageReplyMarkup }) {
  const [, targetId] = match

  debug('handleUnspamUserNo', targetId)
  editMessageReplyMarkup(keyboardUnspamUser({ banned: { id: targetId } }))
}

/**
 * Real unban and remove button
 */
async function handleUnspamUserOk({
  match, from, editMessageText, update, getHammer,
}) {
  const [, targetId] = match
  const hammer = getHammer()
  const { message } = update.callback_query

  debug('handleUnspamUserOk', targetId, { from, message })
  try {
    const originalMessage = reconstructMarkdown(message)

    editMessageText(
      `${originalMessage}\n${text.spamHammer.userUnspammed({ moder: from, spammer: { id: targetId } })}`,
      { parse_mode: 'Markdown' },
    )
    await hammer.whitelistUser({ id: targetId })
  }
  catch (error) {
    debug('handleUnspamUserOk ERROR', error)
  }
}

function installKeyboardActions(bot) {
  bot.action(
    new RegExp(`^${actUnspamUser} ([0-9]+)`),
    adminRequiredSilenced, handleUnspamUser,
  )
  bot.action(
    new RegExp(`^${actUnspamUserOk} ([0-9]+)`),
    adminRequiredSilenced, handleUnspamUserOk,
  )
  bot.action(
    new RegExp(`^${actUnspamUserNo} ([0-9]+)`),
    adminRequiredSilenced, handleUnspamUserNo,
  )
}

module.exports = {
  keyboardUnspamUser,

  installKeyboardActions,
}
