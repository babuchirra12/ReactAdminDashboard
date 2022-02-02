import InputFeild from "./Common/InputFeild";
import CustomButton from "./Common/CustomButton";
import SideMenu from "./Layout/Content";
import Layout from "./Layout/Layout";
import CustomPaginationActionsTable from '../Pages/MeterialTables/MeterilaTableSFP'
function Routing() {
  return (
    <div className="App">
      <Layout>
        <SideMenu>
        <CustomPaginationActionsTable/>
        </SideMenu>
      </Layout>
    </div>
  );
}

export default Routing;
