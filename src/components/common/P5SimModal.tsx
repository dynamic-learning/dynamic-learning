import { Modal, Button } from "antd";
import { Rnd } from "react-rnd";
import { useState } from "react";
import { Sim } from "../../types";
import { DeleteOutlined, SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';

/**
 * This component is exclusively for displaying a p5 sketch iframe
 * Since the size of the iframe is uncertain, the size of the modal box
 * gets changed as we resize the sim
 */

/**
 * Accepts all the props of Modal in antd along with a
 * sim object which is of the form { owner:string, id: string }
 */

const P5SimModal = (props: any) => {

  const { onCancel, onOk,  deleteSelectedSim, modalType } = props;

  const sim:Sim = props.sim;

  const [size, setSize] = useState({ width: 640, height: 360 });

  const handleResize = (
    _e: any,
    _direction: any,
    ref: any,
    _delta: any,
    _position: any
  ) => {
    setSize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    });
  };

  let { width, height } = size;

  if (!(sim && sim._id && sim.owner)) {
    height = 0;
  }

  const handleCancelClick = () => {
    onCancel();
    setSize({ width: 640, height: 360 });
  };

  const handleOKClick = () => {
    onOk();
    setSize({ width: 640, height: 360 });
  };

  const resizeConfig = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: true,
  };

  const handleAddToWorkbook = () => {
    
    console.log('add sim to workbook');
  }

  const footerArray = (modalType: string) => {
    if (modalType == "view-sim-admin") {
      return [        
        <Button onClick={deleteSelectedSim} icon={<DeleteOutlined />} type="dashed" danger>
          Delete 
        </Button>,
        <Button icon={<SaveOutlined />} onClick={handleOKClick}>
          Save
        </Button>,
        <Button icon={<PlusCircleOutlined />} onClick={handleAddToWorkbook}>
          Add 
        </Button>
      ];
    }
    else if (modalType == "view-sim") {
      return [
        <Button icon={<PlusCircleOutlined />} onClick={handleAddToWorkbook}>
          Add to workbook
        </Button>
      ];
    }
    else if (modalType == "add-sim") {
      return [
        <Button icon={<PlusCircleOutlined />} onClick={handleOKClick}>
          Add sim
        </Button>
      ];
    }
    else {
      return [];
    }
  }

  if(sim)
  console.log(`https://editor.p5js.org/${sim.owner}/embed/${sim._id}`);
  return (
    <Modal
      {...props}
      width={width + 50}
      footer={footerArray(modalType)}
    >
      <div style={{ width: width + "px", height: height + "px" }}>
        <Rnd
          enableResizing={resizeConfig}
          disableDragging
          onResize={handleResize}
          size={{ width, height }}
        >
          {sim && sim._id && sim.owner ? (
            <iframe
              width={width}
              height={height}
              scrolling="no"
              src={`https://editor.p5js.org/${sim.owner}/embed/${sim._id}`}
            ></iframe>
          ) : null}
        </Rnd>
      </div>
      <div style={{ width: width + "px" }}>{props.children}</div>
    </Modal>
  );
};

export default P5SimModal;
