import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getBreak,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { searchApiCall1, searchApiCall2, searchApiCall3 } from "./functions";
import get from "lodash/get";
import { searchResultApiResponse } from "./searchResource/searchResultApiResponse";
import { resetAllFields } from "../utils";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const resetAll = async (state, dispatch) => {

  const objectJsonPath = `components.div.children.searchCriteria.children.cardContent.children`;
  const children = get(
    state.screenConfiguration.screenConfig["echallan-landing"],
    objectJsonPath,
    {}
  );
  dispatch(prepareFinalObject("searchCriteriaManageChallan",[]));
  lSRemoveItemlocal('echallanSearchCrieteria');
  lSRemoveItem('echallanSearchCrieteria');
  dispatch(
    handleField(
      "echallan-landing",
      "components.div.children.searchCriteria.children.cardContent.children.viewSeizureContainer.children.challanNo",
      "props.value",
      ""
    )
  );

  resetAllFields(children, dispatch, state, 'echallan-landing');
}
/*...SearchTextViewSizureReport..*/
export const searchCriteria = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Search Criteria",
      labelKey: "EC_REPORT_SEIZURE_SEARCH_CRITERIA"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),

  viewSeizureContainer: getCommonContainer({
    
    challanNo: {
      ...getTextField({
        label: {
          labelName: "Challan No",
          labelKey: "EC_REPORT_CHALLAN_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter Remark",
          labelKey: "EC_REPORT_CHALLAN_NO_LABEL_PLACEHOLDER"
        },
        jsonPath: "searchCriteriaManageChallan[0].challanId",
        required: false,
        pattern: getPattern("ECItemRemark"),
        errorMessage: "EC_ERR_SEZIURE_REMARK_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        // props: {
        //   className: "textfield-enterable-selection"        },
        props: {
          className: "applicant-details-error"
        }
      })
    },
    seizureCriteria: getSelectField({
      label: {
        labelName: "ENCROACHMENT TYPE",
        labelKey: "EC_REPORT_SEIZURE_ENCROACHMENT_TYPE_LABEL"
      },
      optionLabel: "name",
      optionValue: "code",
      placeholder: {
        labelName: "ENCROACHMENT TYPE",
        labelKey: "EC_REPORT_SEIZURE_ENCROACHMENT_TYPE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,

      },
      sourceJsonPath: "applyScreenMdmsData.egec.EncroachmentType",
      jsonPath: "searchCriteriaManageChallan[0].EncroachmentType",
      required: false
    }),
    sector: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchCriteriaManageChallan[0].sector",
      errorMessage: "EC_ERR_DEFAULT_INPUT_SECTOR_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Sector", labelKey: "EC_REPORT_SEIZURE_SECTOR_LABEL" },
        placeholder: {
          labelName: "select Violation Sector",
          labelKey: "EC_REPORT_SEIZURE_SECTOR_PLACEHOLDER"
        },
        jsonPath: "searchCriteriaManageChallan[0].sector",
        sourceJsonPath: "applyScreenMdmsData.egec.sector",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
    SINameSelection: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchCriteriaManageChallan[0].SIName",
      errorMessage: "EC_ERR_DEFAULT_INPUT_SECTOR_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "SI Name", labelKey: "EC_REPORT_SEIZURE_SI_NAME_LABEL" },
        placeholder: {
          labelName: "select SI Name",
          labelKey: "EC_REPORT_SEIZURE_SI_NAME_PLACEHOLDER"
        },
        jsonPath: "searchCriteriaManageChallan[0].SIName",
        sourceJsonPath: "applyScreenMdmsData.egec.SINameList",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
    StartDate: getDateField({
      label: { labelName: "Start Date", labelKey: "EC_REPORT_SEIZURE_START_DATE_LABEL" },
      placeholder: {
        labelName: "Select Start Date",
        labelKey: "EC_REPORT_SEIZURE_START_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "searchCriteriaManageChallan[0].FromDate",
      jsonPath: "searchCriteriaManageChallan[0].FromDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_START_FIELD_MSG"
    }),
    EndDate: getDateField({
      label: { labelName: "End Date", labelKey: "EC_REPORT_SEIZURE_END_DATE_LABEL" },
      placeholder: {
        labelName: "Select End Date",
        labelKey: "EC_REPORT_SEIZURE_END_DATE_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4
      },
      pattern: getPattern("Date"),
      sourceJsonPath: "searchCriteriaManageChallan[0].ToDate",
      jsonPath: "searchCriteriaManageChallan[0].ToDate",
      required: true,
      errorMessage: "EC_ERR_DEFAULT_INPUT_END_FIELD_MSG"
    }),
    ChallanSelection: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchCriteriaManageChallan[0].Status",
      errorMessage: "EC_ERR_DEFAULT_INPUT_STATUS_FIELD_MSG",
      required: true,
      // visible: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 4,
      },
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Status", labelKey: "EC_REPORT_SEIZURE_STATUS_LABEL" },
        placeholder: {
          labelName: "select SI Name",
          labelKey: "EC_REPORT_SEIZURE_STATUS_PLACEHOLDER"
        },
        jsonPath: "searchCriteriaManageChallan[0].Status",
        sourceJsonPath: "applyScreenMdmsData.egec.ChallanStatus",
        labelsFromLocalisation: true,
        // setDataInField: true,
        // suggestions: [],
        fullwidth: true,
        required: false,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
      },

    },
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Apply",
            labelKey: "EC_REPORT_SEIZURE_APPLY_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchResultApiResponse
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 4
        },
        props: {
          variant: "contained",
          style: {
            // margin: "8px",
            color: "rgb(254, 122, 81)",
            background: "#fff",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
            marginBottom: "8px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset All",
            labelKey: "EC_REPORT_RESET_ALL_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            resetAll(state, dispatch)
          }
        }
      }
    })
  })
});
