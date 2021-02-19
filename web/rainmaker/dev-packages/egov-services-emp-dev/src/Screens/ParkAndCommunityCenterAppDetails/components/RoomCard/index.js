import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import ActionButtonDropdown from '../../../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../../../modules/commonFunction'
import {
	downloadEsamparkApp,downloadRoomPaymentRecipt,downloadRoomPermissionLetter,
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import jp from "jsonpath";
import { httpRequest } from "egov-ui-kit/utils/api";

class AppDetails extends Component {

  NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}

			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hunderd " +
					word;
		}
		return word + "Rupees Only";
	};



  downloadPermissionLetterBody = async (e) => {

const {selectedComplaint,userInfo,BKROOM,PaymentDate,receiptNumber,PaymentMode,transactionNumber,downloadRoomPermissionLetter} = this.props

let RoomModel = selectedComplaint && selectedComplaint.bookingsModelList ? (selectedComplaint.bookingsModelList[0].roomsModel ?(selectedComplaint.bookingsModelList[0].roomsModel.length > 0 ? (selectedComplaint.bookingsModelList[0].roomsModel):'NA') :'NA'): 'NA'
let AC = "";
let NonAC = "";
let TypeOfRoom = this.props.typeOfRoom
if(this.props.typeOfRoom == "AC"){
   AC = this.props.totalNumber
  }
else(this.props.typeOfRoom == "NON-AC")
{
  NonAC = this.props.totalNumber
}


let Newugst;
let perFind = 50;
let ugst = this.props.BKROOM_TAX 
let find50Per = (perFind/100) * ugst
console.log("find50Per--",find50Per)		
let findNumOrNot = Number.isInteger(find50Per);
console.log("findNumOrNot--",findNumOrNot)
if(findNumOrNot == true){
  Newugst = find50Per
  console.log("trueCondition")
}
else{
  Newugst = find50Per.toFixed(2);
  console.log("second-Newugst-",Newugst)
}


let toDayDate = new Date()
let approverName;
for(let i = 0; i < userInfo.roles.length ; i++ ){
  if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
    approverName = userInfo.roles[i].name
  }
}

var date2 = new Date();

var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
	

   let BookingInfo = [
      {
          "applicantDetails": {
              "name":  selectedComplaint.bkApplicantName,
              "permanentAddress": selectedComplaint.bkSector,
              "permanentCity": "chandigarh",
              "placeOfService": "Chandigarh"
          },
          "bookingDetails": {
              "bkLocation": selectedComplaint.bkLocation,
              "bkDept": selectedComplaint.bkBookingType,
              "noOfACRooms": AC,
              "noOfNonACRooms": NonAC,
              "bookingPurpose": selectedComplaint.bkBookingPurpose,
              "bkStartDate": this.props.roomFromDate,
              "bkEndDate": this.props.roomToDate,
              "placeOfService": "Chandigarh",
              "venueName": selectedComplaint.bkLocation,
              "sector": selectedComplaint.bkSector,
              "bookingType":selectedComplaint.bkBookingType,
              "applicationDate":this.props.createdDate,
              "bookingPeriod": getDurationDate(
                this.props.roomFromDate,
                this.props.roomToDate
              ),
          },
          "generated": {
              "generatedBy": approverName,
              "generatedDateTime": generatedDateTime
          },
          "approvedBy": {
            "approvedBy": userInfo.name,
            "role": approverName
        },
          "emp": {
              "samparkName": this.props.name,
              "samparkaddress": this.props.Address
          },
          "paymentInfo": {
              "cleaningCharges": "Not Applicable",
              "baseCharge": BKROOM,
              "cgst": Newugst,
              "utgst": Newugst,
              "totalgst": this.props.BKROOM_TAX,
              "refundableCharges": "",
              "totalPayment": this.props.totalAmountPaid,
              "paymentDate": convertEpochToDate(PaymentDate, "dayend"),
              "receiptNo": this.props.receiptNumber,
              "currentDate":   convertEpochToDate(toDayDate, "dayend"),
              "paymentType": this.props.PaymentMode,
              "facilitationCharge": this.props.four,
              "custGSTN": selectedComplaint.bkCustomerGstNo,
              "mcGSTN": "aasdadad",
              "bankName": "",
              "transactionId": this.props.transactionNumber,
              "totalPaymentInWords": this.NumInWords(
                this.props.totalAmountPaid
              ),
              "discType": selectedComplaint.discount
          },
          "tenantInfo": {
              "municipalityName": "Municipal Corporation Chandigarh",
              "address": "New Deluxe Building, Sector 17, Chandigarh",
              "contactNumber": "+91-172-2541002, 0172-2541003",
              "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
               "webSite": "http://mcchandigarh.gov.in",
              "mcGSTN": "aasdadad",
              "statecode": "04",
              "hsncode": this.props.hsnCode
          },
          "bankInfo": {
              "accountholderName": selectedComplaint.bkBankAccountHolder,
              "rBankName": selectedComplaint.bkBankName,
              "rBankACNo": selectedComplaint.bkBankAccountNumber,
              "rIFSCCode": selectedComplaint.bkIfscCode
          }
      }
  ]

  downloadRoomPermissionLetter({ BookingInfo: BookingInfo })
  }

  permissionLetterDownloadFunction = async (e) => {
    await this.downloadPermissionLetterBody();
    const {DownloadBWTApplicationDetails,userInfo,RoomPermissionLetter}=this.props;

    var documentsPreview = [];
    let documentsPreviewData;
    if (RoomPermissionLetter && RoomPermissionLetter.filestoreIds.length > 0) {	
      documentsPreviewData = RoomPermissionLetter.filestoreIds[0];
        documentsPreview.push({
          title: "DOC_DOC_PICTURE",
          fileStoreId: documentsPreviewData,
          linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
        
  
        documentsPreview = documentsPreview.map(function (doc, index) {
          doc["link"] =
            (fileUrls &&
              fileUrls[doc.fileStoreId] &&
              fileUrls[doc.fileStoreId].split(",")[0]) ||
            "";
          
          doc["name"] =
            (fileUrls[doc.fileStoreId] &&
              decodeURIComponent(
                fileUrls[doc.fileStoreId]
                  .split(",")[0]
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`;
          return doc;
        });
    
        setTimeout(() => {
          window.open(documentsPreview[0].link);
        }, 100);
        
      }
  }


  PaymentReceiptDownloadFunction = async (e) => {
    await this.PaymentReceiptDownloadFunctionBody();
    const {DownloadBWTApplicationDetails,userInfo,RoomPaymentReceipt}=this.props;

    var documentsPreview = [];
    let documentsPreviewData;
    if (RoomPaymentReceipt && RoomPaymentReceipt.filestoreIds.length > 0) {	
      documentsPreviewData = RoomPaymentReceipt.filestoreIds[0];
        documentsPreview.push({
          title: "DOC_DOC_PICTURE",
          fileStoreId: documentsPreviewData,
          linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
        
  
        documentsPreview = documentsPreview.map(function (doc, index) {
          doc["link"] =
            (fileUrls &&
              fileUrls[doc.fileStoreId] &&
              fileUrls[doc.fileStoreId].split(",")[0]) ||
            "";
          
          doc["name"] =
            (fileUrls[doc.fileStoreId] &&
              decodeURIComponent(
                fileUrls[doc.fileStoreId]
                  .split(",")[0]
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`;
          return doc;
        });
    
        setTimeout(() => {
          window.open(documentsPreview[0].link);
        }, 100);
        
      }
  }

  PaymentReceiptDownloadFunctionBody = async (e) => { 
    const {selectedComplaint,userInfo,BKROOM,PaymentDate,receiptNumber,PaymentMode,transactionNumber,downloadRoomPermissionLetter,downloadRoomPaymentRecipt} = this.props

    let RoomModel = selectedComplaint && selectedComplaint.bookingsModelList ? (selectedComplaint.bookingsModelList[0].roomsModel ?(selectedComplaint.bookingsModelList[0].roomsModel.length > 0 ? (selectedComplaint.bookingsModelList[0].roomsModel):'NA') :'NA'): 'NA'
    let AC = "";
    let NonAC = "";
    let TypeOfRoom = this.props.typeOfRoom
    if(this.props.typeOfRoom == "AC"){
       AC = this.props.totalNumber
      }
    else(this.props.typeOfRoom == "NON-AC")
    {
      NonAC = this.props.totalNumber
    }


let Newugst;
let perFind = 50;
let ugst = this.props.BKROOM_TAX 
let find50Per = (perFind/100) * ugst
console.log("find50Per--",find50Per)		
let findNumOrNot = Number.isInteger(find50Per);
console.log("findNumOrNot--",findNumOrNot)
if(findNumOrNot == true){
  Newugst = find50Per
  console.log("trueCondition")
}
else{
  Newugst = find50Per.toFixed(2);
  console.log("second-Newugst-",Newugst)
}


let toDayDate = new Date()
let approverName;
for(let i = 0; i < userInfo.roles.length ; i++ ){
  if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
    approverName = userInfo.roles[i].name
  }
}

var date2 = new Date();

var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;

    

  let BookingInfo = [
      {
          "applicantDetails": {
              "name": selectedComplaint.bkApplicantName,
          },
          "booking": {
              "bkLocation": selectedComplaint.bkLocation,
              "bkDept": selectedComplaint.bkBookingType,
              "noOfAcRooms": AC,
              "noOfNonAcRooms": NonAC,
              "bookingPurpose": selectedComplaint.bkBookingPurpose,
              "bkStartDate": this.props.roomFromDate,
              "bkEndDate": this.props.roomToDate,
              "placeOfService": "Chandigarh",
          },
          "generated": {
            "generatedBy": approverName,
            "generatedDateTime": generatedDateTime
        },
        "approvedBy": {
          "approvedBy": userInfo.name,
          "role": approverName
      },
      "emp": {
        "OpCode": this.props.operatorCode,
        "samparkAdd": this.props.Address,
    },
        "paymentInfo": {
          "cleaningCharges": "Not Applicable",
          "baseCharge": BKROOM,
          "cgst": Newugst,
          "utgst": Newugst,
          "totalgst": this.props.BKROOM_TAX,
          "refundableCharges": "",
          "totalPayment": this.props.totalAmountPaid,
          "paymentDate": convertEpochToDate(PaymentDate, "dayend"),
          "receiptNo": this.props.receiptNumber,
          "currentDate":   convertEpochToDate(toDayDate, "dayend"),
          "paymentType": this.props.PaymentMode,
          "facilitationCharge": this.props.four,
          "custGSTN": selectedComplaint.bkCustomerGstNo,
          "mcGSTN": "aasdadad",
          "bankName": "",
          "transactionId": this.props.transactionNumber,
          "totalPaymentInWords": this.NumInWords(
            this.props.totalAmountPaid
          ),
          "discType": selectedComplaint.discount
      },
          "tenantInfo": {
              "municipalityName": "Municipal Corporation Chandigarh",
              "address": "New Deluxe Building, Sector 17, Chandigarh",
              "contactNumber": "+91-172-2541002, 0172-2541003",
              "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
              "webSite": "http://mcchandigarh.gov.in",
              "mcGSTN": "aasdadad",
              "statecode": " 04",
              "hsncode": this.props.hsnCode
          },
          "bankInfo": {
            "accountholderName": selectedComplaint.bkBankAccountHolder,
            "rBankName": selectedComplaint.bkBankName,
            "rBankACNo": selectedComplaint.bkBankAccountNumber,
            "rIFSCCode": selectedComplaint.bkIfscCode
        }
      }
  ]
  downloadRoomPaymentRecipt({ BookingInfo: BookingInfo })

  }
/**
 this.props.roomData.map ((room) =>{
   return (
      <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="BK_MYBK_ROOM_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                <div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
                          menu :
													 [{
														label: {
															labelName: "Permission Letter",
															labelKey: "Permission Letter"
														},
														link: () => this.permissionLetterDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          {
														label: {
															labelName: "Permission Letter",
															labelKey: "Permission Letter"
														},
														link: () => this.PaymentReceiptDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          {
														label: {
															labelName: "Payment Receipt",
															labelKey: "Payment Receipt"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}
                        ]
												}} />

											</div>

              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_NUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={this.props.RoomApplicationNumber}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.totalNumber}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TYPES" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.typeOfRoom}//bkIfscCode
                    />
                  </div>
             
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomFromDate}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomToDate}
                    />
                  </div>
               
               
                </div>
              </div>
            </div>
          }
        />
   )
 })
 */
  render() {
    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="BK_MYBK_ROOM_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                <div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
                          menu :
													 [{
														label: {
															labelName: "Permission Letter",
															labelKey: "Permission Letter"
														},
														link: () => this.permissionLetterDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          {
														label: {
															labelName: "Payment Receipt",
															labelKey: "Payment Receipt"
														},
														link: () => this.PaymentReceiptDownloadFunction('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													},
                          // {
													// 	label: {
													// 		labelName: "Payment Receipt",
													// 		labelKey: "Payment Receipt"
													// 	},
													// 	link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
													// 	leftIcon: "assignment"
													// }
                        ]
												}} />

											</div>

              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_NUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={this.props.RoomApplicationNumber}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.totalNumber}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TYPES" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.typeOfRoom}//bkIfscCode
                    />
                  </div>
             
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomFromDate}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.roomToDate}
                    />
                  </div>
               
               
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
  const {RoomPaymentReceipt,RoomPermissionLetter} = bookings

  return {userInfo,state,RoomPermissionLetter,RoomPaymentReceipt}
}

const mapDispatchToProps = dispatch => {
  return {
    downloadRoomPermissionLetter: criteria => dispatch(downloadRoomPermissionLetter(criteria)),  //
    downloadRoomPaymentRecipt: criteria => dispatch(downloadRoomPaymentRecipt(criteria)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDetails);

// export default AppDetails;
