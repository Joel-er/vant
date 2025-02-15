import { PropType, defineComponent } from 'vue';

// Utils
import {
  isDef,
  truthProp,
  makeStringProp,
  makeNumericProp,
  createNamespace,
} from '../utils';

// Components
import { Cell } from '../cell';

// Types
import type { CouponInfo } from '../coupon';

const [name, bem, t] = createNamespace('coupon-cell');

function formatValue(
  coupons: CouponInfo[],
  chosenCoupon: number | string,
  currency: string
) {
  const coupon = coupons[+chosenCoupon];

  if (coupon) {
    let value = 0;

    if (isDef(coupon.value)) {
      ({ value } = coupon);
    } else if (isDef(coupon.denominations)) {
      value = coupon.denominations;
    }

    return `-${currency} ${(value / 100).toFixed(2)}`;
  }

  return coupons.length === 0 ? t('noCoupon') : t('count', coupons.length);
}

export default defineComponent({
  name,

  props: {
    title: String,
    border: truthProp,
    editable: truthProp,
    currency: makeStringProp('¥'),
    chosenCoupon: makeNumericProp(-1),
    coupons: {
      type: Array as PropType<CouponInfo[]>,
      default: () => [],
    },
  },

  setup(props) {
    return () => {
      const selected = props.coupons[+props.chosenCoupon];
      const value = formatValue(
        props.coupons,
        props.chosenCoupon,
        props.currency
      );

      return (
        <Cell
          class={bem()}
          value={value}
          title={props.title || t('title')}
          border={props.border}
          isLink={props.editable}
          valueClass={bem('value', { selected })}
        />
      );
    };
  },
});
