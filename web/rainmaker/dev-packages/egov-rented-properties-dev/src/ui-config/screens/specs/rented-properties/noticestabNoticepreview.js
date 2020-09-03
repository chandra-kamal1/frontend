import {
    getCommonHeader,getCommonCard,getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg} from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getImages } from "./property-transitImages";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { set } from "lodash";
import {downloadNoticeContainer} from "./applyResource/footer"
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getNoticeReviewProperty, getNoticeViolationPreviewReviewRentDetails, getNoticeRecoveryPreviewReviewRentDetails} from "./applyResource/review-property";

const reviewNoticePropertyDetails = getNoticeReviewProperty(false);
const reviewNoticeViolationRentDetails = getNoticeViolationPreviewReviewRentDetails(false);
const reviewNoticeRecoveryRentDetails = getNoticeRecoveryPreviewReviewRentDetails(false);
const reviewNoticeDocuments = getReviewDocuments(false,"apply","SingleProperties[0].applicationDocuments",true);
let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");
const header = getCommonContainer({
    header : getCommonHeader({
    labelName: "Notice Summary",
    labelKey: "RP_NOTICE_PREVIEW_SUMMARY"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-rented-properties",
    componentPath: "ApplicationNoContainer",
    props: {
      number: NoticedetailsId,
      notice:"Notice"
    }
  }
});

const getData = async(action, state, dispatch) => {
    let NoticedetailsId = getQueryArg(window.location.href, "NoticedetailsId");
    let NoticeId = NoticedetailsId;
    const { screenConfiguration } = state;
    let propertyArr = get(
        screenConfiguration.preparedFinalObject,
        "Properties[0]",
        []);
    let singleNoticeDetails = propertyArr.notices.filter(item => item.memoNumber === NoticeId)
      
    let notices = await getImages(singleNoticeDetails);
    notices = notices.map(item => {
      let { applicationDocuments, urls } = item;
      applicationDocuments = applicationDocuments.map((image, index) => ({ ...image, url: urls[index],
      name: urls[index].split("?")[0].split("/").pop().slice(13)
      }));
      return { ...item, applicationDocuments };
    });
    singleNoticeDetails = [...singleNoticeDetails,notices]  
    dispatch(prepareFinalObject("SingleProperties[0]", singleNoticeDetails[0]));

    const findOwner = propertyArr.owners.find(item => !!item.activeState)
    const orgOwner = propertyArr.owners.find(item => !!item.isPrimaryOwner)
    if(!!orgOwner){
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].originalAllottee",
                orgOwner.ownerDetails.name
            )
            )
    }
    if(!!findOwner.activeState){
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].allotmentStartdate",
                findOwner.ownerDetails.allotmentStartdate
            )
            )
        dispatch(
            prepareFinalObject(
                "SingleProperties[0].allotmenNumber",
                findOwner.allotmenNumber
            )
            )
      
    }

    if(singleNoticeDetails[0].noticeType === "Violation"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeRecoveryRentDetails"
        dispatch(
          handleField(
            "noticestabNoticepreview",
            path,
            "visible",
            false
          )
        );
       }
    else if(singleNoticeDetails[0].noticeType === "Recovery"){
        let path = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeViolationRentDetails"
        let pathdoc = "components.div.children.formwizardFirstStep.children.cardContent.children.reviewNoticeDocuments"
        dispatch(
          handleField(
            "noticestabNoticepreview",
            path,
            "visible",
            false
          )
        );

        dispatch(
            handleField(
              "noticestabNoticepreview",
              pathdoc,
              "visible",
              false
            )
          );      
    }
    dispatch(
      handleField(
        "noticestabNoticepreview",
        "components.div.children.headerDiv.children.header1.children.applicationNumber",
        "props.number",
        NoticeId
      )
    );   
    
    const printCont = downloadNoticeContainer(
      action,
      state,
      dispatch,
      status,
    );

    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );

    
}


const noticeDocumentDetails = getCommonCard({
        reviewNoticePropertyDetails,
        reviewNoticeViolationRentDetails,
        reviewNoticeRecoveryRentDetails,
        reviewNoticeDocuments
    })

const NoticedetailsPreview = {
    uiFramework: "material-ui",
    name: "noticestabNoticepreview",
    beforeInitScreen: (action, state, dispatch) => {
        getData(action, state, dispatch)
        return action;
      },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        header1: {
                            gridDefination: {
                              xs: 12,
                              sm: 8
                            },
                            ...header
                          },
                          helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                              color: "primary",
                              style: { justifyContent: "flex-end" }
                            },
                            gridDefination: {
                              xs: 12,
                              sm: 4,
                              align: "right"
                            }
                          }
                    },
                  
                },
                // rightdiv: {
                //     uiFramework: "custom-atoms",
                //     componentPath: "Container",
                //     props: {
                //       style: { justifyContent: "flex-end", marginTop: 10 }
                //     },
                //     visible:true,
                //     children:{}
                //     // children: {
                //     //   downloadMenu: {
                //     //     uiFramework: "custom-atoms-local",
                //     //     moduleName: "egov-rented-properties",
                //     //     componentPath: "MenuButton",
                //     //     props: {
                //     //       data: {
                //     //         label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
                //     //          leftIcon: "cloud_download",
                //     //         rightIcon: "arrow_drop_down",
                //     //         props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
                //     //         menu: downloadMenu
                //     //       }
                //     //     }
                //     //   },
                //     //   printMenu: {
                //     //     uiFramework: "custom-atoms-local",
                //     //     moduleName: "egov-rented-properties",
                //     //     componentPath: "MenuButton",
                //     //     props: {
                //     //       data: {
                //     //         label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
                //     //         leftIcon: "print",
                //     //         rightIcon: "arrow_drop_down",
                //     //         props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-print-button" },
                //     //         // menu: printMenu
                //     //       }
                //     //     }
                //     //   }
              
                //     // },
                //     // gridDefination: {
                //     //   xs: 12,
                //     //   sm: 6
                //     // }
                //   },
                
                formwizardFirstStep: noticeDocumentDetails
            }
        }
    }
}

export default NoticedetailsPreview