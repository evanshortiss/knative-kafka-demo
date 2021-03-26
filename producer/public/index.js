
;(function (window, document) {

  /**
   * @type {HTMLFormElement}
   */
  const formEl = document.forms['order-form']
  const spinnerEl = document.getElementById('spinner-container')
  const resultEl = document.getElementById('result-container')
  const orderNumEl = document.getElementById('order-num')

  function hide (el) {
    el.classList.add('hidden')
  }

  function show (el) {
    el.classList.remove('hidden')
  }

  formEl.onsubmit = async (e) => {
    e.preventDefault()

    hide(formEl)
    show(spinnerEl)

    try {
      const url = new URL('order', window.location.origin)
      const result = await (await fetch(url)).json()
      setTimeout(() => {
        hide(spinnerEl)
        orderNumEl.innerHTML = `Order ID: ${result.order.orderId}`
        show(resultEl)
      }, 2000)
    } catch (e) {

      spinner.classList.add('hidden')
    }
  }

})(window, document)
