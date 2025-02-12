import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Button } from "../../../components/ui/button";
import phronEyeSrc from "../../../assets/phron-eye.png";
import { formatText } from "../../../smartcontract-builder/utils";
import useContracts from "../../../smartcontract-builder/hooks/contracts";
import DeleteModal from "../../../smartcontract-builder/pages/mainPage/component/sidebar/deleteModal";
import useContract from "../../../smartcontract-builder/hooks/contract";

function ContractSidebar() {
  const { contracts, contractId, changeContract } = useContracts();
  const { deleteContract } = useContract();

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    changeContract(index);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteContract = () => {
    setDeleteModalVisible(true);
    handleMenuClose();
  };

  const handleRenameContract = () => {
    handleMenuClose();
  };

  // const sortedContracts = useMemo(() => {
  //   return contracts.sort((a, b) => {
  //     // @ts-ignore
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  // }, [contracts]);

  return (
    <div
      id="agent-sidebar"
      className="p-5 bg-white rounded-2xl lg:flex flex-col justify-center"
    >
      {/* <DeleteModal isOpen={isDeleteModalVisible} onClose={() => setDeleteModalVisible(false)} /> */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <img
            src={phronEyeSrc}
            alt="phron icon"
            width={14}
            height={14}
            className="object-contain invert"
          />
          <h2 className="text-lg font-semibold">Contracts</h2>
        </div>

        <div className="overflow-auto max-h-[41vh] space-y-3 scrollbar-hide">
          {contracts.map((contract, index) => (
            <Button
              key={index}
              variant={contractId === index ? "default" : "outline"}
              onClick={() => changeContract(index)}
              className="w-full justify-between"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: formatText(contract.name),
                }}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className="h-6 w-2 text-muted-foreground hover:text-destructive flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContract(contract._id);
                      }}
                      aria-label="Delete Contract"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Delete Contract</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
            // <Button
            //     key={index}
            //     variant={contractId === index ? "default" : "outline"}
            //     size="sm"
            //     className={`w-full flex justify-between items-center py-1 px-2 rounded-lg transition-colors duration-200 ${contractId === index ? "bg-blue-100" : "hover:bg-gray-100"}`}
            // >
            //     <span
            //         onClick={() => changeContract(index)}
            //         className={`flex-grow cursor-pointer text-sm ${contractId === index ? "font-bold" : ""
            //             }`}
            //         dangerouslySetInnerHTML={{
            //             __html: formatText(contract.name),
            //         }}
            //     />
            //     <TooltipProvider>
            //         <Tooltip>
            //             <TooltipTrigger asChild>
            //                 <IconButton
            //                     onClick={(e) => handleMenuClick(index, e)}
            //                     aria-label="More options"
            //                     className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            //                 >
            //                     <MoreVertical className="h-4 w-4" />
            //                 </IconButton>
            //             </TooltipTrigger>
            //             <TooltipContent>More Options</TooltipContent>
            //         </Tooltip>
            //     </TooltipProvider>
            //     <Menu
            //         anchorEl={anchorEl}
            //         open={Boolean(anchorEl)}
            //         onClose={handleMenuClose}
            //         sx={{
            //             '& .MuiPaper-root': {
            //                 backgroundColor: '#f0f0f0',
            //                 boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            //                 borderRadius: '8px',
            //             },
            //             '& .MuiMenuItem-root': {
            //                 '&:hover': {
            //                     backgroundColor: '#e0e0e0',
            //                 },
            //             },
            //         }}
            //     >
            //         <MenuItem onClick={handleRenameContract}>
            //             <Edit fontSize="small" sx={{ mr: 1 }} />
            //             Rename
            //         </MenuItem>
            //         <MenuItem onClick={handleDeleteContract}>
            //             <Delete fontSize="small" sx={{ mr: 1, color: '#e53e3e' }} />
            //             Delete
            //         </MenuItem>
            //     </Menu>
            // </Button>
          ))}
        </div>

        {contracts.length === 0 ? (
          <p className="text-sm mt-3 opacity-70">No Contracts found</p>
        ) : null}
      </div>
      <Button className="mt-4" variant="outline" asChild>
        <Link to="/dashboard">
          <Plus className="mr-2 w-4 h-4" />
          Add New Contract
        </Link>
      </Button>
    </div>
  );
}

export default ContractSidebar;
