import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  getCommonGrayCard,
  getLabelWithValue as _getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getTodaysDateInYMD,
  _getPattern
} from "../../utils";
import get from "lodash/get";
import { set } from "lodash";

function getLabelWithValue(labelName, path) {
  const label = _getLabelWithValue(labelName, path);
  label.gridDefination.sm = 3;
  return label;
}

let screenName = "apply";
let paymentStep = "formwizardEighthStep"
if ((window.location.href).includes("allotment")) {
    screenName = "allotment";
    paymentStep = "formwizardSixthStepAllotment";
}

var data = []
new Array(28).fill(undefined).map((val,idx) => {
  data.push({ code: idx + 1 })
});
/***************** Common fields to Ground rent and License fee *********************/
const advancedRentField = {
  label: {
      labelName: "Advance Rent",
      labelKey: "ES_ADVANCED_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advanced Rent",
      labelKey: "ES_ADVANCED_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].advanceRent"
}

const dateOfPaymentOfAdvanceRentField = {
  label: {
      labelName: "Date of Payment of Advance Rent",
      labelKey: "ES_DATE_OF_PAYMENT_OF_ADVANCE_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment of Advance Rent",
      labelKey: "ES_DATE_OF_PAYMENT_OF_ADVANCE_RENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateOfPaymentOfAdvanceRent",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

/************************ Premium Amount Deatails *******************/
const premiumAmountField = {
  label: {
      labelName: "Premium Amount",
      labelKey: "ES_PREMIUM_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Premium Amount",
      labelKey: "ES_PREMIUM_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].premiumAmount"
}

const installmentField = {
  label: {
      labelName: "Installment",
      labelKey: "ES_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Installment",
      labelKey: "ES_INSTALLMENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments[0].installmentAmount"
}

const dueDateForInstallmentField = {
  label: {
      labelName: "Due Date for Installment",
      labelKey: "ES_DUE_DATE_INSTALLMENT_LABEL"
  },
  placeholder: {
      labelName: "Due Date for Installment",
      labelKey: "ES_DUE_DATE_INSTALLMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments[0].dueDate",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const commonInstallmentInformation = () => {
  return getCommonGrayCard({
    header: getCommonTitle({
      labelName: "Installment",
      labelKey: "ES_INSTALLMENT"
    }, {
      style: {
        marginBottom: 18
      }
    }),
    installmentCard: getCommonContainer({
      installment: getTextField(installmentField),
      dueDateForInstallment: getDateField(dueDateForInstallmentField),
    })
  });
};

export const installmentDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    multipleInstallmentContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleInstallmentInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: commonInstallmentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Installment",
              labelKey: "ES_COMMON_ADD_INSTALLMENT_LABEL"
            },
            headerName: "Installment",
            // headerJsonPath: "children.cardContent.children.header.children.key.props.labelKey",
            headerJsonPath: "children.cardContent.children.header.children.Installment.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].installments",
            prefixSourceJsonPath: "children.cardContent.children.installmentCard.children",
            onMultiItemAdd: (state, multiItemContent) => {
              // muliItemContent["dueDateForInstallment"]["visible"] = true;
              return multiItemContent;
            }
          },
          type: "array"
        }
      }
    }
  })
})

const premiumAmountHeader = getCommonTitle({
  labelName: "Premium Amount Details",
  labelKey: "ES_PREMIUM_AMOUNT_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const premiumAmountDetails = getCommonCard({
  header: premiumAmountHeader,
  detailsContainer: getCommonContainer({
    premiumAmount: getTextField(premiumAmountField)
  }),
  installmentContainer: installmentDetails
})

/******************** Select demand ******************/
const getDemandRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].demand",
  props: {
    label: {
      name: "Demand",
      key: "ES_DEMAND_LABEL"
    },
    buttons: [{
        labelName: "Ground Rent",
        labelKey: "ES_GROUND_RENT_LABEL",
        value: "GROUNDRENT"
      },
      {
        label: "License Fee",
        labelKey: "ES_LICENSE_FEE_LABEL",
        value: "LICENSEFEE"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentDetails[0].demand",
    required: true
  },
  required: true,
  type: "array",
  beforeFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        screenName,
        `components.div.children.${paymentStep}.children.groundRentDetails`,
        "visible",
        !!(action.value == "GROUNDRENT")
      )
    )
    dispatch(
      handleField(
        screenName,
        `components.div.children.${paymentStep}.children.licenseFeeDetails`,
        "visible",
        !!(action.value == "LICENSEFEE")
      )
    )
    dispatch(
      handleField(
        "allotment",
        "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewGroundRent",
        "visible",
        !!(action.value == "GROUNDRENT")
      )
    )
    dispatch(
      handleField(
        "allotment",
        "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewLicenseFee",
        "visible",
        !!(action.value == "LICENSEFEE")
      )
    )
    dispatch(
      handleField(
        "allotment",
        "components.div.children.formwizardSeventhStepAllotment.children.reviewAllotmentDetails.children.cardContent.children.reviewAdvanceRent",
        "visible",
        !!(action.value)
      )
    )
  }
};

export const demandSelect = getCommonCard({
  detailsContainer: getCommonContainer({
    demand: getDemandRadioButton
  })
})

/****************** Ground Rent Details **********************/
const groundRentGenerationTypeField = {
  label: {
      labelName: "Ground Rent Generation Type",
      labelKey: "ES_GROUND_RENT_GENERATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter Ground Rent Generation Type",
      labelKey: "ES_GROUND_RENT_GENERATION_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].groundRentGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "Monthly") {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandRent",
          "visible",
          true
        )
      )
    }
    else {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandRent",
          "visible",
          false
        )
      )
    }
  }
}

const billingStartDateField = {
  label: {
      labelName: "Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].billingStartDate",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const dateToGenerateDemandRentField = {
  label: {
    labelName: "Date to Generate the Demand/Rent",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_RENT_LABEL"
  },
  placeholder: {
    labelName: "Select Date to Generate the Demand/Rent",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_RENT_PLACEHOLDER"
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateToGenerateDemandRent",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
      data: data
  },
  visible: false
}

const rentAmountField = {
  label: {
      labelName: "Monthly Rent",
      labelKey: "ES_MONTHLY_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Monthly Rent",
      labelKey: "ES_MONTHLY_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].rentAmount"
}

const startYearField = {
  label: {
      labelName: "Start Month",
      labelKey: "ES_START_MONTH_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Month",
      labelKey: "ES_START_MONTH_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  props: {
    disabled: true,
    value: 0
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].startYear"
}

const endYearField = {
  label: {
      labelName: "End Month",
      labelKey: "ES_END_MONTH_LABEL"
  },
  placeholder: {
      labelName: "Enter End Month",
      labelKey: "ES_END_MONTH_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  props: {
    type: "number",
    helperText: "HIII"
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].endYear"
}

const commonRentInformation = () => {
  return getCommonGrayCard({
    rentCard: getCommonContainer({
      rentAmount: getTextField(rentAmountField),
      startYear: getTextField(startYearField),
      endYear: getTextField(endYearField),
      totalMonths: getLabelWithValue({
        labelName: "Till",
        labelKey: "ES_TILL_LABEL_IN_YEARS"
      },
      {
        jsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent[0].endYear",
        callBack: (value) => (Number(value)/12).toFixed(2)
      }
      )
    })
  });
};

export const rentDetails = getCommonGrayCard({
  detailsContainer: getCommonContainer({
    multipleRentContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        header: getCommonTitle({
          labelName: "Rent",
          labelKey: "ES_RENT"
        }, {
          style: {
            marginBottom: 18
          }
        }),
        multipleRentInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonRentInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add Rent",
              labelKey: "ES_COMMON_ADD_RENT_LABEL"
            },
            headerName: "Rent",
            headerJsonPath: "children.cardContent.children.header.children.Rent.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].rent",
            prefixSourceJsonPath: "children.cardContent.children.rentCard.children",
            afterPrefixJsonPath: "children.value.children.key",
            onMultiItemAdd: (state, multiItemContent) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentDetails[0].rent",
                []
              );
              if (rent.length && rent[rent.length - 1].endYear) {
                let lastAddedEndYear = rent[rent.length - 1].endYear;
                multiItemContent.startYear.props.value = Number(lastAddedEndYear) + 1;
              } 
              // else {
              //   multiItemContent.startYear.props.disabled = false
              // }
              return multiItemContent;
            },
            onMultiItemDelete: (state, deletedIndex, changeField) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentDetails[0].rent",
                []
              );
              if(deletedIndex !== rent.length - 1) {
                const previewYearObj = rent.filter((item, index) => index < deletedIndex && item.isDeleted !== false).pop()
                const nextYearObj = rent.findIndex((item, index) => index > deletedIndex && item.isDeleted !== false)
                nextYearObj !== -1 && changeField(
                  "allotment",
                  `components.div.children.formwizardSixthStepAllotment.children.groundRentDetails.children.cardContent.children.rentContainer.children.cardContent.children.detailsContainer.children.multipleRentContainer.children.multipleRentInfo.props.items[${nextYearObj}].item${nextYearObj}.children.cardContent.children.rentCard.children.startYear`,
                  "props.value",
                  !!previewYearObj && !!previewYearObj.endYear ? Number(previewYearObj.endYear)+1 : 0
                )
              }
            }
          },
          type: "array"
        }
      }
    }
  })
})
const groundRentHeader = getCommonTitle({
  labelName: "Ground Rent Details",
  labelKey: "ES_GROUND_RENT_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const groundRentDetails = getCommonCard({
  header: groundRentHeader,
  detailsContainer: getCommonContainer({
    groundRentGenerationType: getSelectField(groundRentGenerationTypeField),
    billingStartDate: getDateField(billingStartDateField),
    dateToGenerateDemandRent: getSelectField(dateToGenerateDemandRentField),
    advanceRent: getTextField(advancedRentField),
    dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  rentContainer: rentDetails
})


/*********************** License Fee Details ************************/
const licenseFeeGenerationTypeField = {
  label: {
      labelName: "License Fee Generation Type",
      labelKey: "ES_LICENSE_FEE_GENERATION_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee Generation Type",
      labelKey: "ES_LICENSE_FEE_GENERATION_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFeeGenerationType",
  props: {
    data: [
      {code: "Monthly"},
      {code: "Annually"}
    ]
  },
  beforeFieldChange: (action, state, dispatch) => {
    if (action.value == "Monthly") {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandLf",
          "visible",
          true
        )
      )
    }
    else {
      dispatch(
        handleField(
          "allotment",
          "components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.detailsContainer.children.dateToGenerateDemandLf",
          "visible",
          false
        )
      )
    }
  }
}

const dateToGenerateDemandLicenseFeeField = {
  label: {
    labelName: "Date to Generate the Demand/License Fee",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_LICENSE_FEE_LABEL"
  },
  placeholder: {
    labelName: "Select Date to Generate the Demand/License Fee",
    labelKey: "ES_DATE_TO_GENERATE_DEMAND_LICENSE_FEE_PLACEHOLDER"
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].dateToGenerateDemandLf",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
      data: data
  },
  visible: false
}

const billingStartDateLicenseFeeField = {
  label: {
      labelName: "Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_LABEL"
  },
  placeholder: {
      labelName: "Enter Billing Start Date",
      labelKey: "ES_BILLING_START_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].billingStartDateLf",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const licenseFeeField = {
  label: {
      labelName: "License Fee",
      labelKey: "ES_LICENSE_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter License Fee",
      labelKey: "ES_LICENSE_FEE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].licenseFee"
}

const startYearLfField = {
  label: {
      labelName: "Start Month",
      labelKey: "ES_START_MONTH_LABEL"
  },
  placeholder: {
      labelName: "Enter Start Month",
      labelKey: "ES_START_MONTH_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  props: {
    disabled: true,
    value: 0
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].startYear"
}

const endYearLfField = {
  label: {
      labelName: "End Month",
      labelKey: "ES_END_MONTH_LABEL"
  },
  placeholder: {
      labelName: "Enter End Month",
      labelKey: "ES_END_MONTH_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 3
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].endYear"
}


const commonLicenseInformation = () => {
  return getCommonGrayCard({
    licenseCard: getCommonContainer({
      licenseFee: getTextField(licenseFeeField),
      startYear: getTextField(startYearLfField),
      endYear: getTextField(endYearLfField),
      totalMonths: getLabelWithValue({
        labelName: "Till",
        labelKey: "ES_TILL_LABEL_IN_YEARS"
      },
      {
        jsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees[0].endYear",
        callBack: (value) => (Number(value)/12).toFixed(2)
      }
      )
    })
  });
};

export const licenseFeeForYearDetails = getCommonGrayCard({
  detailsContainer: getCommonContainer({
    multipleLicenseContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        header: getCommonTitle({
          labelName: "License Fee for Year",
          labelKey: "ES_LICENSE_FEE_FOR_YEAR"
        }, {
          style: {
            marginBottom: 18
          }
        }),
        multipleLicenseInfo: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "MultiItem",
          props: {
            scheama: commonLicenseInformation(),
            items: [],
            addItemLabel: {
              labelName: "Add License Fee",
              labelKey: "ES_COMMON_LICENSE_FEE_LABEL"
            },
            headerName: "License Fee for Year",
            // headerJsonPath: "children.cardContent.children.header.children.key.props.labelKey",
            headerJsonPath: "children.cardContent.children.header.children.License Fee.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.paymentDetails[0].licenseFees",
            prefixSourceJsonPath: "children.cardContent.children.licenseCard.children",

            afterPrefixJsonPath: "children.value.children.key",
            onMultiItemAdd: (state, multiItemContent) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentDetails[0].licenseFees",
                []
              );
              if (rent.length && rent[rent.length - 1].endYear) {
                let lastAddedEndYear = rent[rent.length - 1].endYear;
                multiItemContent.startYear.props.value = Number(lastAddedEndYear) + 1;
              } 
              // else {
              //   multiItemContent.startYear.props.disabled = false
              // }
              return multiItemContent;
            },
            onMultiItemDelete: (state, deletedIndex, changeField) => {
              let rent = get(
                state.screenConfiguration.preparedFinalObject,
                "Properties[0].propertyDetails.paymentDetails[0].licenseFees",
                []
              );
              if(deletedIndex !== rent.length - 1) {
                const previewYearObj = rent.filter((item, index) => index < deletedIndex && item.isDeleted !== false).pop()
                const nextYearObj = rent.findIndex((item, index) => index > deletedIndex && item.isDeleted !== false)
                nextYearObj !== -1 && changeField(
                  "allotment",
                  `components.div.children.formwizardSixthStepAllotment.children.licenseFeeDetails.children.cardContent.children.licenseFeeForYearContainer.children.cardContent.children.detailsContainer.children.multipleLicenseContainer.children.multipleLicenseInfo.props.items[${nextYearObj}].item${nextYearObj}.children.cardContent.children.licenseCard.children.startYear`,
                  "props.value",
                  !!previewYearObj && !!previewYearObj.endYear ? Number(previewYearObj.endYear)+1 : 0
                )
              }
            }
          },
          type: "array"
        }
      }
    }
  })
})

const licenseFeeHeader = getCommonTitle({
  labelName: "License Fee Details",
  labelKey: "ES_LICENSE_FEE_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const licenseFeeDetails = getCommonCard({
  header: licenseFeeHeader,
  detailsContainer: getCommonContainer({
      demandGenerationType: getSelectField(licenseFeeGenerationTypeField),
      dateToGenerateDemandLf: getSelectField(dateToGenerateDemandLicenseFeeField),
      billingStartDateLf: getDateField(billingStartDateLicenseFeeField),
      advanceRent: getTextField(advancedRentField),
      dateOfPaymentOfAdvanceRent: getDateField(dateOfPaymentOfAdvanceRentField)
  }),
  licenseFeeForYearContainer: licenseFeeForYearDetails
})


/******************** Security Fee Details ********************/ 
const securityFeeAmountField = {
  label: {
      labelName: "Security Fee Amount",
      labelKey: "ES_SECURITY_FEE_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Security Fee Amount",
      labelKey: "ES_SECURITY_FEE_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].securityFeeAmount"
}

const dateOfPaymentField = {
  label: {
      labelName: "Date of Payment",
      labelKey: "ES_DATE_OF_PAYMENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment",
      labelKey: "ES_DATE_OF_PAYMENT_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].securityFeeDateOfPayment",
  // props: {
  //     inputProps: {
  //         max: getTodaysDateInYMD()
  //     }
  // }
}

const getMonthsOfRentRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].monthsOfRent",
  props: {
    buttons: [{
        labelName: "2 months of rent",
        labelKey: "ES_TWO_MONTHS_RENT_LABEL",
        value: "TWOMONTHSRENT"
      },
      {
        label: "3 months rent",
        labelKey: "ES_THREE_MONTHS_RENT_LABEL",
        value: "THREEMONTHSRENT"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentDetails[0].monthsOfRent",
    // required: true
  },
  // required: true,
  type: "array"
}

const securityDetailsHeader = getCommonTitle({
  labelName: "Security Details",
  labelKey: "ES_SECURITY_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const securityDetails = getCommonCard({
  header: securityDetailsHeader,
  detailsContainer: getCommonContainer({
      securityFeeAmount: getTextField(securityFeeAmountField),
      monthsOfRent: getMonthsOfRentRadioButton,
      securityFeeDateOfPayment: getDateField(dateOfPaymentField),
      
  })
})

/******************** Interest Details ********************/
const getInterestFixedRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].interestFixed",
  props: {
    label: {
      name: "Interest fixed?",
      key: "ES_INTEREST_FIXED_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true"
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false"
      }
    ],
    jsonPath: "Properties[0].propertyDetails.paymentDetails[0].interestFixed",
    // required: true
  },
  // required: true,
  type: "array"
}

const percentageOfInterestField = {
  label: {
      labelName: "Percentage of interest",
      labelKey: "ES_PERCENTAGE_OF_INTEREST_LABEL"
  },
  placeholder: {
      labelName: "Enter percentage of interest",
      labelKey: "ES_PERCENTAGE_OF_INTEREST_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("float"),
  jsonPath: "Properties[0].propertyDetails.paymentDetails[0].percentageOfInterest"
}

const interestDetailsHeader = getCommonTitle({
  labelName: "Interest Details",
  labelKey: "ES_INTEREST_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const interestDetails = getCommonCard({
  header: interestDetailsHeader,
  detailsContainer: getCommonContainer({
    interestFixed: getInterestFixedRadioButton,
    percentageOfInterest: getTextField(percentageOfInterestField)
  })
})