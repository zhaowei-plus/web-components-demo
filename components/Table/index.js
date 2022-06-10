class FcTable extends HTMLElement {

  static get observedAttributes() {
    return ['columns', 'data', 'actions']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = `
      <style>
        table {
          width: 100%;
          height: auto;
          border: 1px solid red;
          font-size: 12px;
        }

        thead th {
          min-height: 32px;
          background-color: #0abdc0;
          color: #fff;
        }

        thead th,
        tbody td {
          border: 1px solid #ddd;
          text-align: center;
          padding: 5px;
          position: relative;
        }

        tbody {
          position: relative;
        }

        tbody:empty {
          min-height: 68px;
          border: 1px solid red;
          display: flex;
          align-item: center;
        }

        tbody:empty:after {
          position: absolute;
          content: '暂无数据';
          width: 100%;
          height: 100%;
          text-align: center;
        }

        .td-actions {
          border: 1px solid red;
        }

        .td-actions a {
          margin:0 5px;
          cursor: pointer;
        }
      
      </style>
      <table>
        <thead></thead>
        <tbody></tbody>
      </table>
    `
  }

  connectedCallback() {
    console.log('fc-table 第一次被连接到文档DOM时被调用')
    console.log('columns:', this.columns)
    console.log('data:', this.data)
  }

  get columns() {
    return JSON.parse(this.getAttribute('columns') || '[]');
  }

  get data() {
    return JSON.parse(this.getAttribute('data') || '[]');
  }

  get actions() {
    return JSON.parse(this.getAttribute('actions') || '[]');
  }

  render () {l
    this.renderColumns()
    this.renderData()
  }

  renderData () {
    const tbody = this.shadowRoot.querySelector('tbody')
    tbody.innerHTML = ''
    if (this.data.length > 0) {
      const tbodyFragment = document.createElement('tbody')
  
      tbody.innerHTML = this.data.map((record, index) => {
        const tr = document.createElement('tr')
        this.columns.map(column => {
          const td = document.createElement('td')
          td.innerText = record[column.key] || ''

          if (column.key === 'actions') {
            td.setAttribute('class', 'td-actions')
            
            this.actions.map(({ title, type }) => {
              const a = document.createElement('a')
              a.addEventListener('click', () => {
                this.dispatchEvent(
                  new CustomEvent('onActions', { detail: { record, type } })
                )
              })
              a.innerHTML = title
              td.append(a)
            })
          }
          tr.append(td)
        })
        tbodyFragment.append(tr)
      })
      tbody.replaceWith(tbodyFragment)
    } else {
      // tbody.innerHTML = '暂无数据'
    }
  }

  renderColumns () {
    const thead = this.shadowRoot.querySelector('thead')
    thead.innerHTML = this.columns.map(column => `<th width="260">${column.title}</th>`).join('')
  }

  disconnectedCallback () {
    console.log('fc-table 与文档DOM断开连接时被调用')
  }

  adoptedCallback() {
    console.log('fc-table 当自定义元素被移动到新文档时被调用')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }
}

window.customElements.define('fc-table', FcTable)