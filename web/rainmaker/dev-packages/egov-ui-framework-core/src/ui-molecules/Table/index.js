import React from "react";
import MUIDataTable from "mui-datatables";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import { connect } from "react-redux";

class Table extends React.Component {
  state = {
    data: [],
    columns: [],
    customSortOrder: "asc",
    title:undefined
  };

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiPaper: {
          root: {
            backgroundColor: "#FFF",
            overflowX: "scroll"
          }
        },
        MUIDataTableBodyCell: {
          root: {
            "&:nth-child(2)": {
              color: "#2196F3",
              cursor: "pointer"
            }
          }
        },
        MuiTypography: {
          caption: {
            fontSize: "14px"
          }
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px"
          }
        },
        MuiTableCell: {
          body: {
            fontSize: 14
          }
        }
      }
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach(column => {
          debugger
          // Handling the case where column name is an object with options
          column = typeof column === "object" ? get(column, "name") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  columnLocalisation = (localizationLabels, columns) => {
    const  localisationArray = Object.values(localizationLabels);
    const {columns : stateColumn} = this.state;
    const { title } = this.state;
    let columnName = []
    columns.forEach(column => {
      // Handling the case where column name is an object with options
      column = typeof column === "object" ? get(column, "name") : column;

      const locMessageObj =  localisationArray.find(locMessage => locMessage.code === column);

      if(locMessageObj){
      
         columnName.push(locMessageObj.message);
      }
      else{
        columnName.push(column);
      }

    });
    console.log("columnNames",columnName);
    
    const checkFlag = _.isEqual(columnName.sort(), stateColumn.sort());
    if(!checkFlag){
      this.setState({columns : columnName});
    }
    const locMessageTitleObj = localisationArray.find(locMessage => locMessage.code === title);
    
    if (title && title != undefined && locMessageTitleObj!=undefined && locMessageTitleObj[0]!=undefined)  { 
      this.setState({title : locMessageTitleObj[0].message});
    }
    
  }
  
  
    componentDidUpdate (prevProps, prevState){
    const {localizationLabels} = this.props;
    const { data, columns } = this.props;
    this.columnLocalisation(localizationLabels, columns);
  }


  componentWillReceiveProps(nextProps) {
    const { data, columns,title } = nextProps;
    this.updateTable(data, columns,title);
  }

  componentDidMount() {
    const { data, columns,title } = this.props;
    this.updateTable(data, columns,title);
  }

  updateTable = (data, columns,title) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: fixedColumns,
      title:title

    });
  };

  onColumnSortChange = (columnName, i) => {
    let { customSortOrder, data } = this.state;
    const { customSortColumn } = this.props;
    const { column, sortingFn } = customSortColumn;
    if (columnName === column) {
      const updatedData = sortingFn(cloneDeep(data), "", customSortOrder);
      this.setState({
        data: updatedData.data,
        customSortOrder: updatedData.currentOrder
      });
    }
  };

  render() {
    const { data, columns,title } = this.state;
    const { options, customSortDate } = this.props;

    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={{
            ...options,
            onColumnSortChange: (columnName, order) =>
              this.onColumnSortChange(columnName, order)
          }}
        />
      </MuiThemeProvider>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
};

  
const mapStateToProps = (state, ownProps) => {
  let localizationLabels = get(
      state,
      "app.localizationLabels",
      []
  );
  return { localizationLabels };
};
export default connect(mapStateToProps, null)(Table);