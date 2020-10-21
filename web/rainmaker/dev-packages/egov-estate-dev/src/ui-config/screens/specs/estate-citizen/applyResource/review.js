import { getCommonSubHeader, getCommonGrayCard, getLabelWithValue as _getLabelWithValue, getCommonContainer, getCommonCard, getCommonTitle, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "../footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDate } from "../../utils";

function getLabelWithValue(labelName, path, visible) {
  const label = _getLabelWithValue(labelName, path);
  label.visible = visible
  // label.gridDefination.xs = 12;
  return label;
}


const headerDiv = (isEditable = true, label, step) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
        style: { marginBottom: "10px" }
    },
    children: {
      header: {
          gridDefination: {
              xs: 12,
              sm: 10
          },
          ...getCommonSubHeader({
              labelName: label,
              labelKey: label
          })
      },
      editSection: {
        componentPath: "Button",
        props: {
            color: "primary"
        },
        gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
        },
        children: {
            editIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                    iconName: "edit"
                }
            },
            buttonLabel: getLabel({
                labelName: "Edit",
                labelKey: "ES_SUMMARY_EDIT"
            })
        },
        visible: isEditable,
        onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
            changeStep(state, dispatch, "_apply", "", step);
        }
    }
    }
    }
  }
}

export const viewFour = (section, data) => {
  const {fields = [], type} = section
  switch(type) {
    case "DOCUMENTS" : {
      return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-estate",
        componentPath: "DownloadFileContainer",
        props: {
          sourceJsonPath: section.sourceJsonPath,
          className: "review-documents"
        }
      }
    }
    case "LIST": {
      return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-estate",
        componentPath: "MultipleCardContainer",
        props: {
          sourceJsonPath: section.sourceJsonPath,
          contents: section.fields
        }
      }
    }
    default: {
      const field_types = fields.reduce((acc, field) => {
        const visible = !!field.visibility && !!data ? eval(field.visibility) : true
        return {
        ...acc, 
        [field.label]: getLabelWithValue({
          labelName: field.label,
          labelKey: field.label
        },
        { jsonPath: field.jsonPath,
          callBack: field.type === "date" ? convertEpochToDate : null
        }, visible)
        }
      }, {})
      return getCommonContainer(field_types)
    }
  }
}

export const setThirdStep = async ({state, dispatch, applicationType, preview, data, isEdit = true, showHeader = true}) => {
    // const {preview} = require(`../${applicationType}_preview.json`);
    const {sections = []} = preview;
    let details = sections.reduce((acc, section, index) => {
      const {step, header, isEditable = true} = section
      return {
        ...acc,
        [section.header]: getCommonGrayCard({
          headerDiv: headerDiv(isEdit && isEditable , header, step),
          viewFour: viewFour(section, data)
        })
      }
    }, {})
    details = !!showHeader ? { header: getCommonTitle({
      labelName: "Summary",
      labelKey: "ES_SUMMARY_HEADER"
    }),
    ...details
    } : details
    // const reviewDetails = getCommonCard({
    //   ...details
    // })
    //  return reviewDetails
    return details
  }