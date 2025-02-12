import { useNavigate } from "react-router-dom";

import { TableRow, TableCell } from "../../../components/ui/table";
import { styledString } from "../../utils";
import useOracle from "../../hooks/useOracle";
import "./index.scss";

const Subscription = ({ sub, key, index }) => {
  const { oracleId } = sub;
  let num = Number(index) + 1;
  console.log("sub");
  const { oracle }: any = useOracle({ id: oracleId });
  const navigate = useNavigate();

  const goToOracle = () => {
    navigate(`/oracle/detail/${oracleId}`);
  };

  return (
    <TableRow onClick={goToOracle}>
      <TableCell className="rounded-tl-lg pl-4">{num}</TableCell>
      <TableCell>{styledString(sub.oracleId)}</TableCell>
      <TableCell>{oracle.name}</TableCell>
      <TableCell>{styledString(sub.user)}</TableCell>
      <TableCell>{styledString(sub.userContract)}</TableCell>
      <TableCell className="rounded-tr-lg pr-4">{sub.expire}</TableCell>
    </TableRow>
    // <tr className="sub-tr" onClick={goToOracle} >
    //     <td>{num}</td>
    //     <td>{styledString(sub.oracleId)}</td>
    //     <td>{oracle.name}</td>
    //     <td>{styledString(sub.user)}</td>
    //     <td>{styledString(sub.userContract)}</td>
    //     <td>{sub.expire}</td>
    // </tr>
  );
};

export default Subscription;