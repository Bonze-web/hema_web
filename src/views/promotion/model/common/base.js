/**
 * 促销对象基类
 */

/** 默认促销对象 */
const DEF_PROM_OBJS = {
  amountCondition: {
    type: "amountCondition",
    total: 0,
    stepInfo: {
      type: 'NONE', // 默认不允许步进
      stairSteps: []
    }
  },
  countCondition: {
    type: "countCondition",
    count: 0,
    stepInfo: {
      type: 'NONE', // 默认不允许步进
      stairSteps: []
    }
  },
  storeCondition: {
    type: "storeCondition",
    stores: []
  },
  businessCondition: {
    type: "businessCondition",
    business: []
  },
  goodsCondition: {
    type: "goodsCondition",
    goods: {
      uuid: "",
      code: "",
      name: ""
    }
  },
  memberGradeCondition: {
    type: "memberGradeCondition",
    grade: {
      uuid: "",
      code: "",
      name: ""
    }
  },
  memberScoreCondition: {
    type: "memberScoreCondition",
    total: 0,
    stepInfo: {
      type: 'NONE', // 默认不允许步进
      stairSteps: []
    }
  },
  memberBirthdayCondition: {
    type: "memberBirthdayCondition",
    isBirthday: true
  },
  memberDayCondition: {
    type: "memberDayCondition",
    days: []
  },
  categoryCondition: {
    type: "categoryCondition",
    category: {
      uuid: "",
      code: "",
      name: ""
    },
    excludesGoods: []
  },
  brandCondition: {
    type: "brandCondition",
    brand: {
      uuid: "",
      code: "",
      name: ""
    },
    excludesGoods: []
  },
  eventCondition: {
    type: "eventCondition",
    event: {
      type: '',
      params: ''
    }
  },
  compositeCondition: {
    type: "compositeCondition",
    logical: 'or',
    conditions: []
  },
  basketCondition: {
    type: "basketCondition",
    logical: 'or',
    conditions: [{
      /** 第一个条件是商品过滤条件 */
      type: "compositeCondition",
      logical: 'or',
      conditions: []
    }, {
      /** 第二个条件是统计过滤条件 */
      type: "compositeCondition",
      logical: 'or',
      conditions: []
    }]
  },

  deductionAction: {
    type: "deductionAction",
    body: 'consumer',
    description: '抵扣金额',
    total: 0,
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  discountAction: {
    type: "discountAction",
    body: 'consumer',
    description: '订单折扣',
    // 默认不打折
    total: 100,
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  goodsDiscountAction: {
    type: "goodsDiscountAction",
    body: 'consumer',
    description: '商品折扣',
    // 默认不打折
    allRate: 100,
    // 单个折扣
    rates: [],
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  scoreAction: {
    type: "scoreAction",
    body: 'consumer',
    description: '送积分',
    total: 0,
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  nscoreAction: {
    type: "nscoreAction",
    body: 'consumer',
    description: '翻倍积分',
    total: 1,
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  goodsAction: {
    type: "goodsAction",
    body: 'consumer',
    description: '送商品',
    goods: {
      uuid: "",
      code: "",
      name: ""
    },
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  prizeAction: {
    type: "prizeAction",
    body: 'consumer',
    description: '送奖品',
    prize: {
      uuid: "",
      code: "",
      name: ""
    },
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  couponAction: {
    type: "couponAction",
    activity: {
      uuid: "",
      code: "",
      name: ""
    },
    count: 1,
    description: '送券',
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  excouponAction: {
    type: "couponAction",
    activity: {
      uuid: "",
      code: "",
      name: "",
      source: "DLY"
    },
    count: 1,
    description: '送外部券',
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  useCouponAction: {
    type: "useCouponAction",
    activity: {
      uuid: "",
      code: "",
      name: ""
    },
    count: 1,
    description: '用券',
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  },
  priceAction: {
    type: "priceAction",
    price: null,
    description: '促销价',
    priority: 1,
    conflicts: [],
    constraints: {
      maxTotalCount: 0,
      maxDayCount: 0,
      maxPerMember: 0,
      maxPerMemberPerDay: 0
    }
  }
};

import * as Utils from "@/utils/index";

export default {

  computed: {

    /**
     * 促销结果类型列表
     */
    actionTypes: function() {
      var types = [];
      for (var key in DEF_PROM_OBJS) {
        if (key.indexOf('Action') > 0) {
          types.push({
            type: key,
            description: DEF_PROM_OBJS[key].description
          });
        }
      }
      return types;
    }

  },

  methods: {

    /**
     * 执行数据验证
     */
    validate() {
      console.log("开始执行数据校验");
      return null;
    },

    /** 复制JSON对象 */
    cloneObj(src) {
      if (!src) {
        return null;
      } else {
        var json = JSON.stringify(src);
        return JSON.parse(json);
      }
    },

    /** 取得默认的促销对象 */
    getDefPromObj(type) {
      var obj = DEF_PROM_OBJS[type];
      if (obj) {
        obj = this.cloneObj(obj);
      }
      return obj;
    },

    /**
     * 显示错误
     * 
     * @param {*} err 
     */
    showError(err) {
      Utils.showError(err);
    }

  }

}
