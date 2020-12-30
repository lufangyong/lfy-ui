/**
 * dispatch: 会派发一个事件，这个事件首先在自己这个组件实例上去触发，然后会沿着父级链一级一级的往上冒泡，直到触发了某个父级中声明的对这个事件的监听器后就停止，除非是这个监听器返回了true。当然监听器也是可以通过回调函数获取到事件派发的时候传递的所有参数的。这一点很像我们在DOM中的事件冒泡机制，应该不难理解。
 * broadcast: 就是会将事件广播到自己的所有子组件实例上，一层一层的往下走，因为组件树的原因，往下走的过程会遇到 “分叉”，也就可以看成是一条条的多个路径。事件沿着每一个子路径向下冒泡，每个路径上触发了监听器就停止，如果监听器返回的是true那就继续向下再传播。
 * 简单总结一下。dispatch 派发事件往上冒泡，broadcast 广播事件往下散播，遇到处理对应事件的监听器就处理，监听器没有返回true就停止
 * 需要注意的是，这里的派发和广播事件都是跨层级的 , 而且可以携带参数，那也就意味着可以跨层级进行数据通信。
 */

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}

export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
  },
}
