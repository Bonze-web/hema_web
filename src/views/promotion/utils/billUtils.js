/**
 * 促销单相关工具类
 */

const EMPTY_BILL = {
  id: "",
  state: "unsubmit",
  subject: "",
  remark: "",
  precondition: {
    type: "compositeCondition",
    conditions: [{
        type: "timeRangeCondition",
        begin: "",
        end: "",
        beginEquals: true,
        endEquals: false
      },
      {
        type: "compositeCondition",
        conditions: [{
            type: "storeCondition",
            stores: [{
              uuid: "ALL",
              code: "",
              name: "全部"
            }]
          },
          {
            type: "businessCondition",
            business: [{
              uuid: "ALL",
              code: "",
              name: "全部"
            }]
          }
        ],
        logical: "or"
      }
    ],
    logical: "and"
  },
  exps: [{
    type: "ifThenExpression",
    condition: {
      type: "compositeCondition",
      conditions: [],
      logical: "and"
    },
    actions: []
  }]
};

/**
 * 促销单状态常量
 */
export const BILL_STATES = [{
    value: "unsubmit",
    label: "未提交"
  },
  {
    value: "submit",
    label: "已提交"
  },
  {
    value: "abolished",
    label: "已作废"
  },
  {
    value: "expired",
    label: "已过期"
  }
];

/**
 * 创建新的促销单
 */
export function emptyBill() {
  var json = JSON.stringify(EMPTY_BILL);
  return JSON.parse(json);
}

/**
 * 取得单据状态名称 
 * @param {*} state 
 */
export function getStateName(state) {
  var name = BILL_STATES.find(st => st.value === state);
  return name ? name.label : "未知";
}

/**
 * 创建新的表达式
 */
export function newExpression() {
  return emptyBill().exps[0];
}
