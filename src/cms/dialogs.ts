function openDialog(message: string, inputLabel?: string): Promise<string | null> {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog')
    dialog.className = 'cms-confirmation'
    dialog.setAttribute('aria-label', message)
    const form = document.createElement('form')
    form.method = 'dialog'
    const description = document.createElement('p')
    description.textContent = message
    form.append(description)
    let input: HTMLInputElement | undefined
    if (inputLabel) {
      const label = document.createElement('label')
      label.textContent = inputLabel
      input = document.createElement('input')
      input.type = 'url'; input.required = true; input.autofocus = true
      label.append(input); form.append(label)
    }
    const actions = document.createElement('div')
    const cancel = document.createElement('button')
    cancel.type = 'button'; cancel.textContent = 'Annulla'; cancel.className = 'secondary'
    cancel.onclick = () => dialog.close('cancel')
    const confirm = document.createElement('button')
    confirm.type = 'submit'; confirm.textContent = 'Conferma'; confirm.value = 'confirm'
    actions.append(cancel, confirm); form.append(actions); dialog.append(form)
    dialog.addEventListener('close', () => { const value = dialog.returnValue === 'confirm' ? input?.value || 'confirmed' : null; dialog.remove(); resolve(value) }, { once: true })
    document.body.append(dialog); dialog.showModal()
    if (!input) cancel.focus()
  })
}
export const confirmAction = async (message: string) => (await openDialog(message)) !== null
export const requestUrl = (message: string) => openDialog(message, 'Indirizzo HTTPS')
