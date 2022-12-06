/**
 * vite 3.2.4  依赖vite实验性设置 https://cn.vitejs.dev/guide/build.html#advanced-base-options
 */

const resetPublicPathBySource = (
  dynamicUrl,
  path = '/sourceConfig.json',
  sourcePath
) => `
function loadJson() {
  var url = '';
    if("${dynamicUrl}"){
      url = "${dynamicUrl}" + "${path}"
    }else{
      url =  window.location.origin + "${path}";
    }
    var resultUrl = '';
      // url = 'http://test.21tb.com/sourceConfig.json'
    var request = new XMLHttpRequest()
    request.open('get', url)
    request.send(null)
    request.onload = function() {
      if (request.status == 200) {
        var json = JSON.parse(request.responseText)
         // var url = json.sourceUrl + '/vue3-project/';
        var resultUrl = json.sourceUrl + "${sourcePath}";
        window.__toCdnUrl = resultUrl;
      }else{
        var resultUrl = window.location.origin + '${sourcePath || '/'}';
        window.__toCdnUrl = resultUrl;
      }
    }
    request.onerror = function() {
      var resultUrl = window.location.origin + '${sourcePath || '/'}';
      window.__toCdnUrl = resultUrl;
    }
}
loadJson();`

const insertLoadJsonCode = (viteOptions) =>
  `<script async>${resetPublicPathBySource(
    '',
    viteOptions.loadSourceConfig.filePath,
    ''
  )}</script>`
const insertHeadCode = `<script>
  /**
   * @description: 
   * @return {*}
   * @param {*} fileName  文件名
   * @param {*} path  文件路径
   * @param {*} insertTimeout  获取到前缀后多长时间插入
   * @param {*} retryCount  重试次数
   */
  function asyncAppendNode(taglink, path, insertTimeout = 400, retryCount = 5) {
    var time = null
    var count = 0
    // css，js文件地址
    function createUrl() {
      return window.__toCdnUrl + path
    }
    function insert() {
      let node
      // 如果taglink以<script开头，则插入js文件
      if (taglink.startsWith('<script')) {
        //替换taglink中的src属性
        node =
          taglink.replace(/src=".*?"/, 'src="' + createUrl() + '" />')
      } else if (taglink.startsWith('<link')) {
        //替换taglink中的href属性
        node = taglink.replace(/href=".*?"/, 'href="' + createUrl() + '"')
      }
      let doc = new DOMParser().parseFromString(node, 'text/html')
      document.head.appendChild(doc.documentElement)
    }
  
    function startTask() {
      count++
      time && clearTimeout(time)
      if (window.__toCdnUrl) {
        setTimeout(() => {
          console.log((insertTimeout || 200) + 'ms后插入')
          insert()
        }, insertTimeout || 200)
      } else {
        if (!retryCount || retryCount > count) {
          time = setTimeout(() => {
            startTask()
          }, 200)
        }
      }
    }
    startTask()
  }
  </script>`

function resolveScriptPath(html, viteOptions) {
  const scriptReg = /<script.*?src="(.*?)".*?>/g
  let scriptMatch = scriptReg.exec(html)
  const scriptArr = []
  while (scriptMatch) {
    scriptArr.push([scriptMatch[0], scriptMatch[1]])
    scriptMatch = scriptReg.exec(html)
  }
  scriptArr.forEach((item) => {
    const newScriptWithAppendNode = `<script>asyncAppendNode('${item[0]}','${item[1]}',${viteOptions.loadSourceConfig.insertTimeout},${viteOptions.loadSourceConfig.retryCount});</script>`
    html = html.replace(item[0], newScriptWithAppendNode)
  })
  return html
}

function resolveLinkPath(html, viteOptions) {
  const linkReg = /<link.*?href="(.*?)".*?>/g
  let linkMatch = linkReg.exec(html)

  const linkArr = []
  while (linkMatch) {
    linkArr.push([linkMatch[0], linkMatch[1]])
    linkMatch = linkReg.exec(html)
  }
  linkArr.forEach((item) => {
    const newLinkWithAppendNode = `<script>asyncAppendNode('${item[0]}','${item[1]}',${viteOptions.loadSourceConfig.insertTimeout},${viteOptions.loadSourceConfig.retryCount});</script>`
    html = html.replace(item[0], newLinkWithAppendNode)
  })
  return html
}

const VITE_PLUGIN_NAME = 'vite-plugin-vue-dynamic-path'
// 修改异步加载的资源的路径的方法

export default function vitePluginVueDynamicPath(options) {
  const viteOptions = options || {
    loadSourceConfig: {
      sourcePath: '/vue3-project/',
      insertTimeout: 400,
      retryCount: 5,
      filePath: '/sourceConfig.json'
    }
  }
  return {
    name: VITE_PLUGIN_NAME,
    enforce: 'pre',
    config(config, { command }) {
      if (command === 'build') {
        config.experimental = {
          renderBuiltUrl(filename, { hostId }) {
            if (hostId !== 'index.html') {
              return {
                runtime: `window.__toCdnUrl(${JSON.stringify(filename)})`
              }
            } else {
              return { relative: true }
            }
          }
        }
      }
    },
    resolveId(id) {
      if (id === VITE_PLUGIN_NAME) {
        return id
      }
    },
    transformIndexHtml(html) {
      html = html.replace(/<head>/, '<head>' + insertHeadCode)
      html = html.replace(/<head>/, '<head>' + insertLoadJsonCode(viteOptions))
      html = resolveScriptPath(html, viteOptions)
      html = resolveLinkPath(html, viteOptions)
      return html
    },

    closeBundle() {
      console.log('Build complete. The dist directory is ready to be deployed.')
    }
  }
}
