import { ref, watch, onMounted, defineComponent } from 'vue';
import { numericProp, createNamespace } from '../utils';
import { Swipe, SwipeInstance } from '../swipe';

const [name, bem] = createNamespace('tabs');

export default defineComponent({
  name,

  props: {
    inited: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    lazyRender: Boolean,
    count: {
      type: Number,
      required: true,
    },
    duration: {
      type: numericProp,
      required: true,
    },
    currentIndex: {
      type: Number,
      required: true,
    },
  },

  emits: ['change'],

  setup(props, { emit, slots }) {
    const swipeRef = ref<SwipeInstance>();

    const onChange = (index: number) => emit('change', index);

    const renderChildren = () => {
      const Content = slots.default?.();

      if (props.animated || props.swipeable) {
        return (
          <Swipe
            ref={swipeRef}
            loop={false}
            class={bem('track')}
            duration={+props.duration * 1000}
            touchable={props.swipeable}
            lazyRender={props.lazyRender}
            showIndicators={false}
            onChange={onChange}
          >
            {Content}
          </Swipe>
        );
      }

      return Content;
    };

    const swipeToCurrentTab = (index: number) => {
      const swipe = swipeRef.value;
      if (swipe && swipe.state.active !== index) {
        swipe.swipeTo(index, { immediate: !props.inited });
      }
    };

    watch(() => props.currentIndex, swipeToCurrentTab);

    onMounted(() => {
      swipeToCurrentTab(props.currentIndex);
    });

    return () => (
      <div
        class={bem('content', {
          animated: props.animated || props.swipeable,
        })}
      >
        {renderChildren()}
      </div>
    );
  },
});
