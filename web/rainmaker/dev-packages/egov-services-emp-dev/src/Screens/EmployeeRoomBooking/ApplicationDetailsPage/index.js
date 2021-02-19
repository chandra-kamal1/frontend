import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { Screen } from "modules/common";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
// import AppDetails from "../AllApplications/components/ApplicantDetails"
// import OSBMBookingDetails from "../AllApplications/components/OSBMBookingDetails"
// import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import PaymentDetails from "../AllApplications/components/PaymentDetails"
// import ApproveBooking from "../ApplicationResolved";
// import RejectBooking from "../RejectComplaint";
import axios from "axios";
import jp, { value } from "jsonpath";
import { httpRequest } from "egov-ui-kit/utils/api";
// import {
// 	getFileUrlFromAPI,
// } from "egov-ui-framework/ui-utils/commons";
import {
	getDateFromEpoch,
	mapCompIDToName,
	isImage,
	fetchImages,
	returnSLAStatus,
	getPropertyFromObj,
	findLatestAssignee,
	getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment, downloadPaymentReceipt, downloadApplication,
	sendMessage,downloadPermissionLetter,
	sendMessageMedia
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
// import DialogContainer from '../../modules/DialogContainer';
// import Footer from "../../modules/footer"
// import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
// import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../modules/commonFunction'
import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';



const styles = (theme) => ({

});
const dosalogStyle = {
	flex: '1 1 auto',
	padding: '0 24px 24px',
	overflowY: 'auto',
	overflowScrolling: 'touch',
	zIndex: '2000',
}

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({

}))(MuiDialogContent);

class ApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType: '',
			open: false,
			setOpen: false,
			togglepopup: false,
			actionOnApplication: '',
			actionTittle: '',
			actionOpen: false,
			BankName: '',
			RoomDocument: '',
			commRoomData: ''
		};
	};

	handleActionButtonClose = () => {
		this.setState({
			actionOpen: false
		})
	};

	handleActionButtonOpen = () => {
		this.setState({
			actionOpen: true
		})
	};

 
	componentDidMount = async () => {

		let fetchUrl = window.location.pathname;
        console.log(fetchUrl)
         
        let fetchApplicationNumber = fetchUrl.substring(fetchUrl.lastIndexOf('/') + 1)
        console.log("fetchApplicationNumber--",fetchApplicationNumber)

   let createAppData = {
    "applicationNumber": fetchApplicationNumber,
	"applicationStatus": "",
	"typeOfRoom": "",
	"fromDate": "",
	"toDate": ""
    }
		
	let payloadfund = await httpRequest(
			"bookings/api/employee/community/center/room/_search",
			"_search",[],
			createAppData
			);

	console.log("payloadfund--",payloadfund)		
	this.props.prepareFinalObject("DataOfRoomAndCommunity",payloadfund)
	let documentForBothBooking = payloadfund.communityCenterDocumentMap
	console.log("documentForBothBooking-",documentForBothBooking)
	let RoomCommData = payloadfund.communityCenterRoomBookingMap
    console.log("RoomCommData--",RoomCommData)
	let AllKeysOfRoom = []
	let AllValues
	for (const [key] of Object.entries(RoomCommData)) {
		console.log("allKeys--",`${key}`);
		AllKeysOfRoom.push(`${key}`)
	  }
    console.log("AllKeysOfRoom--",AllKeysOfRoom)
	console.log("RoomApplicationNumber--",AllKeysOfRoom[0].roomApplicationNumber,AllKeysOfRoom[0].typeOfRoom)
	//["RoomsModel(id=8fa9e31d-f71a-4aff-8e55-a2879e124b4e, roomApplicationNumber=CH-BK-ROOM-2021-02-16-004311, typeOfRoom=AC, totalNoOfRooms=25, communityApplicationNumber=CH-BK-2021-02-16-004309, roomApplicationStatus=OFFLINE_APPLIED, roomBusinessService=BKROOM, remarks=string, action=OFFLINE_APPLY, lastModifiedDate=2021-02-16, createdDate=2021-02-16, fromDate=2021-04-22, toDate=2021-04-22, discount=null, facilationCharge=null, roomPaymentStatus=null)"]
	AllValues = Object.values(RoomCommData)
	console.log("AllValues--",AllValues);
	this.props.prepareFinalObject("DataOfRoomAndCommunity.MainData",AllValues[0])
	this.setState({
		RoomDocument:documentForBothBooking,
		commRoomData:AllValues[0]
	})
	}

	actionButtonOnClick = (e, complaintNo, label) => {
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})
		} else {
			this.setState({
				actionTittle: "Reject Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: label
		})
	};

	btnTwoOnClick = (complaintNo, label) => {
		
		let { history } = this.props;
		switch (label) {
			case "ES_COMMON_ASSIGN":
				history.push(`/assign-complaint/${complaintNo}`);
				break;
			case "ES_COMMON_REASSIGN":
				history.push(`/reassign-complaint/${complaintNo}`);
				break;
			case "BK_MYBK_RESOLVE_MARK_RESOLVED":
				history.push(`/booking-resolved/${complaintNo}`);
				break;
		}
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		})

	};
	handleClose = () => {
		this.setState({
			openPopup: false
		})
	};

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

	downloadPaymentReceiptFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceipt, userInfo,pdfBankName } = this.props;
		const { complaint } = transformedComplaint;
		console.log("stateBankName--",this.state.BankName ? this.state.BankName : "NA")
		
		var date2 = new Date();

		var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
	

		let BookingInfo = [{
			"applicantDetail": {
				"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
				"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
				"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
				"permanentAddress": complaint && complaint.address ? complaint.address : '',
				"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
				"sector": complaint && complaint.sector ? complaint.sector : ''
			},
			"booking": {
				"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
			},
			"paymentInfo": {
				"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
				"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
				"bookingPeriod": getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),
				"bookingItem": "Online Payment Against Booking of Open Space for Building Material",
				"amount": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
					(el) => !el.taxHeadCode.includes("PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
				)[0].amount,
				"tax": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
					(el) => el.taxHeadCode.includes("CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
				)[0].amount,
				"grandTotal": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
				"amountInWords": this.NumInWords(
					paymentDetailsForReceipt.Payments[0].totalAmountPaid
				),
				paymentItemExtraColumnLabel: "Booking Period",
				paymentMode:
					paymentDetailsForReceipt.Payments[0].paymentMode,
					bankName: pdfBankName !== "NA" ? pdfBankName : this.state.BankName,
				receiptNo:
					paymentDetailsForReceipt.Payments[0].paymentDetails[0]
						.receiptNumber,
				
			},
			payerInfo: {
				payerName: paymentDetailsForReceipt.Payments[0].payerName,
				payerMobile:
					paymentDetailsForReceipt.Payments[0].mobileNumber,
			},
			"generatedBy": {
				"generatedBy": userInfo.name,
				"generatedDateTime":generatedDateTime
			  }
		}
		]
		downloadPaymentReceipt({ BookingInfo: BookingInfo })
	}

	
	downloadApplicationFunction = async (e) => {
		const { ab,xyz,Newugst } = this.props;
		const { transformedComplaint, paymentDetailsForReceipt, downloadApplication,paymentDetails,userInfo,documentMap } = this.props;
		let fdocname = Object.entries(documentMap)[0][1]
		let value1 = xyz[1];
		console.log("value1--",value1)
		let value2 = ab[1];
		console.log("value2--",value2)

		var date2 = new Date();

	var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;


		const { complaint } = transformedComplaint;
		let bookingDataOsbm = {
            applicationNumber: complaint.applicationNo,
            houseNo: complaint.houseNo,
            locality: complaint.sector,
            completeAddress: complaint.address,
            applicationDate: complaint.dateCreated,
            villageOrCity: complaint.villageCity,
            propertyType: complaint.residentialCommercial,
            storageAreaRequired: complaint.areaRequired,
            category: complaint.bkCategory,
            typeOfConstruction: complaint.bkConstructionType,
            
            duration:
                complaint.bkDuration == "1"
                    ? `${complaint.bkDuration} Month`
                    : `${complaint.bkDuration} Months`,
            categoryImage: "",
        };
	
		
		let appData = [
            {
                applicantDetail: {
                    name: complaint.applicantName,
                    mobileNumber: complaint.bkMobileNumber,
                    houseNo: complaint.houseNo,
                    permanentAddress: complaint.address,
                    
                    sector: complaint.sector,
                    email: complaint.bkEmail,
                },
                bookingDetail:bookingDataOsbm,
                feeDetail: {
                    baseCharge:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => !el.taxHeadCode.includes("PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"))[0].amount,
                    taxes:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => el.taxHeadCode.includes("CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"))[0].amount,
					ugst: Newugst,
					cgst: Newugst,
					
					totalAmount:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.totalAmount,
				},
				"generatedBy": {
					"generatedBy": userInfo.name,
					"generatedDateTime":generatedDateTime
				  },
				documentDetail:{
					documentName: value1,
					document2: value2
				}

            },
        ];
		// let tenantId= userInfo&&userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "";
		// console.log('tenantId==in applicaion details page',tenantId);
		downloadApplication( { BookingInfo: appData })
		

	}
	
	downloadApplicationButton = async (mode) => {
		
		await this.downloadApplicationFunction();
		setTimeout(async()=>{
		const { DownloadApplicationDetails,userInfo } = this.props;
		var documentsPreview = [];
		let documentsPreviewData;
		if (DownloadApplicationDetails && DownloadApplicationDetails.filestoreIds.length > 0) {	
			documentsPreviewData = DownloadApplicationDetails.filestoreIds[0];
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
				if(mode==='print'){

					var response = await axios.get(documentsPreview[0].link, {
						//responseType: "blob",
						responseType: "arraybuffer",
						
						
						headers: {
							"Content-Type": "application/json",
							Accept: "application/pdf",
						},
					});
					console.log("responseData---", response);
					const file = new Blob([response.data], { type: "application/pdf" });
					const fileURL = URL.createObjectURL(file);
					var myWindow = window.open(fileURL);
					if (myWindow != undefined) {
						myWindow.addEventListener("load", (event) => {
							myWindow.focus();
							myWindow.print();
						});
					}

				}


				else{

					setTimeout(() => {
					
						window.open(documentsPreview[0].link);
					}, 100);
				}
				
				prepareFinalObject('documentsPreview', documentsPreview)
			}
		},1500)
	}
	

	
downloadPermissionLetterButton = async (mode) => {
	await this.downloadPermissionLetterFunction();
	setTimeout(async()=>{
	
		let documentsPreviewData;
		const { DownloadPermissionLetterDetails,userInfo } = this.props;
		var documentsPreview = [];
		if (DownloadPermissionLetterDetails && DownloadPermissionLetterDetails.filestoreIds.length > 0) {
			 documentsPreviewData=DownloadPermissionLetterDetails.filestoreIds[0];
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
			
			if(mode==='print'){
	
				var response = await axios.get(documentsPreview[0].link, {
					//responseType: "blob",
					responseType: "arraybuffer",
					
					
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				});
				console.log("responseData---", response);
				const file = new Blob([response.data], { type: "application/pdf" });
				const fileURL = URL.createObjectURL(file);
				var myWindow = window.open(fileURL);
				if (myWindow != undefined) {
					myWindow.addEventListener("load", (event) => {
						myWindow.focus();
						myWindow.print();
					});
				}
	
			}
			else{
	
				setTimeout(() => {
				
					window.open(documentsPreview[0].link);
				}, 100);
			}
			
			prepareFinalObject('documentsPreview', documentsPreview)
			
	}
	},1500)
	

}

downloadPermissionLetterFunction = async (e) => {
	const { transformedComplaint,paymentDetails,downloadPermissionLetter ,userInfo} = this.props;
	const {complaint} = transformedComplaint;

	let approverName;
	//userInfo.roles
		if(complaint.bookingType === "OSBM"){
			for(let i = 0; i < userInfo.roles.length ; i++ ){
				if(userInfo.roles[i].code == "BK_OSBM_APPROVER"){
					approverName = userInfo.roles[i].name
				}
			}
	
		}

	let receiptData = [
		{
			applicantDetail: {
				name: complaint.applicantName,
				mobileNumber: complaint.bkMobileNumber,
				houseNo: complaint.houseNo,
				permanentAddress: complaint.address,
				permanentCity: complaint.villageCity,
				sector: complaint.sector,
			},
			bookingDetail: {
				applicationNumber:
				complaint.applicationNo,
				applicationDate: convertEpochToDate(
					complaint.dateCreated,"dayend"
				),
				bookingPeriod: getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),
				
				villageOrCity: complaint.villageCity,
				residentialOrCommercial: complaint.residentialCommercial,
				areaRequired: complaint.areaRequired,
				category: complaint.bkCategory,
				typeOfConstruction: complaint.bkConstructionType,
				permissionPeriod: getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),

				duration:
				complaint.bkDuration == "1"
					? `${complaint.bkDuration} Month`
					: `${complaint.bkDuration} Months`,
			categoryImage: "",
				groundName:complaint.sector
			},



			approvedBy:{
				approvedBy: userInfo.name,
				role: approverName,
			},
			tenantInfo:{
				municipalityName: "Municipal Corporation Chandigarh",
				address: "New Deluxe Building, Sector 17, Chandigarh",
				contactNumber: "+91-172-2541002, 0172-2541003",
				logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",
				webSite: "http://mcchandigarh.gov.in"
			},
			generatedBy: {
				generatedBy: userInfo.name,
			}
		}]

	downloadPermissionLetter({BookingInfo:receiptData})
}
	
	downloadPaymentReceiptButton = async (mode) => {
		this.downloadPaymentReceiptFunction();
		setTimeout(async()=>{
		let documentsPreviewData;
		const { DownloadPaymentReceiptDetails,userInfo } = this.props;
		var documentsPreview = [];
		if (DownloadPaymentReceiptDetails && DownloadPaymentReceiptDetails.filestoreIds.length > 0) {	
		documentsPreviewData = DownloadPaymentReceiptDetails.filestoreIds[0];
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
			
			if(mode==='print'){

				var response = await axios.get(documentsPreview[0].link, {
					//responseType: "blob",
					responseType: "arraybuffer",
					
					
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				});
				console.log("responseData---", response);
				const file = new Blob([response.data], { type: "application/pdf" });
				const fileURL = URL.createObjectURL(file);
				var myWindow = window.open(fileURL);
				if (myWindow != undefined) {
					myWindow.addEventListener("load", (event) => {
						myWindow.focus();
						myWindow.print();
					});
				}

			}
			else{

				setTimeout(() => {
				
					window.open(documentsPreview[0].link);
				}, 100);
			}
			
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	},1500)
	}


	callApiForDocumentData = async (e) => {
		const { xyz,userInfo } = this.props;
		console.log("xyzInPDF--",xyz)
		var documentsPreview = [];
		if (xyz && xyz.length > 0) {
			console.log("xyzGreater--",xyz)
			console.log("key[0-",xyz[0])
			let keys = xyz[0]
			console.log("key---",keys)
			let values = xyz[1];
			console.log("valuesInDoc--",values)
			let id = keys
			console.log("id--",id)
			let	fileName = values[0];
            console.log("fileName--",fileName)
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,changetenantId) : {};
		

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
			prepareFinalObject('documentsPreview', documentsPreview)
		}



	}

	DownloadOtherDocumentData = async (e) => {
		const { ab,userInfo } = this.props;
		var documentsPreview = [];
		if (ab && ab.length > 0) {
			let keys = ab[0];
			console.log("keys2--",keys)
			let values = ab[1];
			console.log("values2--",values)
			let id = keys
			console.log("id2--",id)
			let	fileName = values[0];
            console.log("fileName--",fileName)
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,changetenantId) : {};
		

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
			prepareFinalObject('documentsPreview', documentsPreview)
		}



	}

	render() {
		console.log("state--inrender",this.state)
		
		return (
			<div>
				<h1>hello</h1>
			</div>
			// <div>
			// 	<Screen>
			// 			<div>
			// 				<div className="form-without-button-cont-generic">
			// 					<div className="container" >
			// 						<div className="row">
			// 							<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>

			// 								Application Details
			// 							</div>
			// 							{/* <div className="col-12 col-md-6 row">
			// 								<div class="col-12 col-md-6 col-sm-3" >
			// 									<ActionButtonDropdown data={{
			// 										label: { labelName: "Download ", labelKey: "BK_COMMON_DOWNLOAD_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										leftIcon: "cloud_download",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
			// 										},
			// 										menu: (complaint.status=='APPROVED')?[{
			// 											label: {
			// 												labelName: "Receipt",
			// 												labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
			// 											},

			// 											link: () => this.downloadPaymentReceiptButton('Receipt'),
			// 											leftIcon: "receipt"
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "PermissionLetter",
			// 												labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
			// 											},
			// 											link: () => this.downloadPermissionLetterButton('PermissionLetter'),
			// 											leftIcon: "book"
			// 										},{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
			// 											leftIcon: "assignment"
			// 										}]:
			// 										[{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_DOWNLOAD_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('Application'),
			// 											leftIcon: "assignment"
			// 										}]
			// 									}} />
			// 								</div>
			// 								<div class="col-12 col-md-6 col-sm-3" >
			// 									<ActionButtonDropdown data={{
			// 										label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										leftIcon: "print",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
			// 										},
			// 										menu:  (complaint.status=='APPROVED')?[{
			// 											label: {
			// 												labelName: "Receipt",
			// 												labelKey: "BK_MYBK_PRINT_RECEIPT"
			// 											},

			// 											link: () => this.downloadPaymentReceiptButton('print'),
			// 											leftIcon: "receipt"
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "PermissionLetter",
			// 												labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
			// 											},
			// 											 link: () => this.downloadPermissionLetterButton('print'),
			// 											 leftIcon: "book"
			// 										},{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('print'),
			// 											leftIcon: "assignment"
			// 										}]:[{
			// 											label: {
			// 												labelName: "Application",
			// 												labelKey: "BK_MYBK_PRINT_APPLICATION"
			// 											},
			// 											link: () => this.downloadApplicationButton('print'),
			// 											leftIcon: "assignment"
			// 										}]
			// 									}} />

			// 								</div>
			// 							</div> */}
			// 						</div>
			// 					</div>

			// 					{/* <OSMCCBookingDetails
			// 						{...complaint}
			// 						historyApiData={historyApiData && historyApiData}
			// 					/>

            //                     <AppDetails
			// 						{...complaint}

			// 					/>

			// 					<OSBMBookingDetails
			// 						{...complaint}
			// 						historyApiData={historyApiData && historyApiData}
			// 					/>
								

			// 					<PaymentDetails
			// 						paymentDetails={paymentDetails && paymentDetails}
			// 					/>
			// 					 */}
			// 					<div style={{
			// 						height: "100px",
			// 						width: "100",
			// 						backgroundColor: "white",
			// 						border: "2px solid white",
			// 						boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
			// 					}}><b>Documents</b><br></br>

			// 						{/* {documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"} */}
			// 						{xyz && xyz ? xyz[1] : "Not Found"}
			// 						<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
			// 					</div>

			// 					<div style={{
			// 						height: "100px",
			// 						width: "100",
			// 						backgroundColor: "white",
			// 						border: "2px solid white",
			// 						boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
			// 					}}><b>Other Documents</b><br></br>

			// 						{/* {documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"} */}
			// 						{ab && ab ? ab[1] : "Not Found"}
			// 						<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.DownloadOtherDocumentData(e) }}>VIEW</button>
			// 					</div>

			// 					<Comments
			// 						comments={comments}
			// 						role={role}
			// 						isAssignedToEmployee={isAssignedToEmployee}
			// 					/>
			// 				</div>
			// 				<div style={{
			// 					paddingTop: "30px",
			// 					paddingRight: "30px", float: "right",
			// 				}}>
			// 					{(role === "ao" &&
			// 						complaint.complaintStatus.toLowerCase() !== "closed") ||
			// 						(role === "eo" &&
			// 							(complaint.status.toLowerCase() === "escalatedlevel1pending" ||
			// 								complaint.status.toLowerCase() === "escalatedlevel2pending" ||
			// 								complaint.status.toLowerCase() === "assigned")) ||
			// 						(role === "employee" &&
			// 							(
			// 								(complaint.status == "PENDINGAPPROVAL" &&
												

			// 									<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
			// 										label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
			// 										rightIcon: "arrow_drop_down",
			// 										props: {
			// 											variant: "outlined",
			// 											style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "48px", width: "250px" }
			// 										},
			// 										menu: [{
			// 											label: {
			// 												labelName: "Approve",
			// 												labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
			// 											},

			// 											link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
			// 										},
			// 										{
			// 											label: {
			// 												labelName: "Reject",
			// 												labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
			// 											},
			// 											link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
			// 										}]
			// 									}} />}></Footer>
			// 								)

			// 							)
			// 						)}

			// 					<DialogContainer
			// 						toggle={this.state.togglepopup}
			// 						actionTittle={this.state.actionTittle}
			// 						togglepopup={this.actionButtonOnClick}									
			// 						maxWidth={'md'}
			// 						children={this.state.actionOnApplication == 'APPROVED' ? <ApproveBooking
			// 							applicationNumber={match.params.applicationId}
			// 							userInfo={userInfo}
			// 						/> : <RejectBooking
			// 								applicationNumber={match.params.applicationId}
			// 								userInfo={userInfo}
			// 							/>}
			// 					/>

			// 				</div>
			// 			</div>
					
			// 	</Screen>
			// </div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { applicationData } = bookings;
	const { DownloadPaymentReceiptDetails,DownloadApplicationDetails,DownloadPermissionLetterDetails } = bookings;
	
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),

		downloadPaymentReceipt: criteria => dispatch(downloadPaymentReceipt(criteria)),
downloadPermissionLetter: criteria => dispatch(downloadPermissionLetter(criteria)),
		downloadApplication: criteria => dispatch(downloadApplication(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
			dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApplicationDetails);




