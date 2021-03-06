import P5SimModal from "../../common/P5SimModal";
import { useState } from "react";
import SimDetails from "./SimDetails";
import SimDetailsEditable from "./SimDetailsEditable";
import { Button, Card, Spin } from "antd";
import {
  DeleteOutlined,
  SaveOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { getNewSim } from "../../../utils/workbook";
import { useRouter } from "next/router"

interface Props {
  sims: Array<any>;
  onSimUpdate(updatedSim: any): void;
  onSimDelete: (deletedSim: any) => void;
  loading: any;
  setLoading(loading:boolean):void;
}

const SimsList = (props: Props) => {
  const { sims, onSimUpdate, onSimDelete, loading, setLoading } = props;

  const [simModal, updateSimModal] = useState({ sim: {}, showSimModal: false });

  const { isAdmin } = useAuth();

  const router = useRouter();

  const handleSimClick = (index: number) => {
    return () => {
      updateSimModal({
        sim: sims[index],
        showSimModal: true,
      });
    };
  };

  const updateSelectedSim = (editedValue: string, valueType: string) => {
    updateSimModal({
      sim: {
        ...simModal.sim,
        [valueType]: editedValue,
      },
      showSimModal: simModal.showSimModal,
    });
  };

  const handleSave = () => {
    onSimUpdate(simModal.sim);
    handleModalClose();
  };

  const handleModalClose = () => {
    updateSimModal({
      ...simModal,
      showSimModal: false,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete the sim?")) {
      onSimDelete(simModal.sim);
      handleModalClose();
    }
  };

  const handleAddSimToWorkbook = () => {
    setLoading(true);
    localStorage.setItem(
      "sim-to-add", 
      //@ts-ignore
      JSON.stringify(getNewSim(simModal.sim.owner, simModal.sim._id))
    )
    const savedState = localStorage.getItem("savedState")
    if(savedState) {
      const parsedState = JSON.parse(savedState);
      router.push(parsedState.atPath);
    }
    handleModalClose();
  };
  

  const footerArray = () => {
    if (isAdmin) {
      return [
        <Button
          onClick={handleDelete}
          icon={<DeleteOutlined />}
          type="dashed"
          danger
        >
          Delete
        </Button>,
        <Button icon={<SaveOutlined />} onClick={handleSave}>
          Save
        </Button>,
        <Button icon={<PlusCircleOutlined />} onClick={handleAddSimToWorkbook}>
          Add to workbook
        </Button>,
      ];
    } else {
      return [
        <Button icon={<PlusCircleOutlined />} onClick={handleAddSimToWorkbook}>
          Add to workbook
        </Button>,
      ];
    }
  };

  const SimsList = () => (
    <>
      {sims.map((sim: any, index: number) => (
        <Card
          style={{ width: "180px", margin: " 20px" }}
          onClick={handleSimClick(index)}
          hoverable={true}
          cover={
            <img
              alt="example"
              src={sim.imageURL}
              style={{ height: "180px", width: "180px", margin: "0px auto" }}
              className="sim-block"
              key={sim._id}
            />
          }
        >
          <h2>{sim.title}</h2>
          <div style={{ margin: "5px 0px", color: "grey" }}>
            {sim.description}
          </div>
        </Card>
      ))}
    </>
  );
  return (
    <>
      <style>{style}</style>
      <P5SimModal
        centered
        title="Simulation"
        sim={simModal.sim}
        visible={simModal.showSimModal}
        footer={footerArray()}
        handleModalClose={handleModalClose}
      >
        {isAdmin ? (
          <SimDetailsEditable
            selectedSim={simModal.sim}
            updateSelectedSim={updateSelectedSim}
          />
        ) : (
          <SimDetails selectedSim={simModal.sim} />
        )}
      </P5SimModal>
      {loading ? (
        <Spin className="no-simulation-found" size="large" />
      ) : sims.length === 0 ? (
        <div className="no-simulation-found">No simulations found</div>
      ) : (
        <ul className="flex-container wrap">
          <SimsList />
        </ul>
      )}
    </>
  );
};

const style = `
    .no-simulation-found {
      margin: 0 auto;
      display: flex;
      height: 75%;
      width: fit-content;
      flex-direction: row;
      align-items: center;
    }
    .flex-container {
        list-style: none;
        padding:0;
        margin:0;
        display: flex;
    }
    .sim-block {
        padding:5px;
        width: 100px;
        height: 100px;
        margin: 1rem;
        cursor:pointer;
        border:1px solid lightgrey;
    }
    .flex-item:hover {
        background-color:#1890ff;
    }
    .wrap { 
        flex-wrap: wrap;
    }  
    .ant-card-body {
      padding:10px;
    }
     h2 {
      margin-bottom:0;
      line-height:30px;
      font-size:18px;
    }
`;

export default SimsList;
