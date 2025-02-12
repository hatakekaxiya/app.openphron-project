import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styledString } from "../../../../utils";
import { Button } from "../../../../../components/ui/button";
import { Plus } from "lucide-react";
import { useAccount } from "wagmi";
import phronEyeSrc from "../../../../../assets/phron-eye.png";
import useOracles from "../../../../hooks/useOracles";
import "./index.scss";

const CSidebar = ({ setOracleId }) => {
  const { address } = useAccount();
  const { oracles } = useOracles();
  const [flag, setFlag] = useState(0);

  const userOracles = oracles.filter((item) => item.owner === address);

  useEffect(() => {
    if (userOracles.length > 0 && flag === 0) {
      setOracleId(userOracles[0].id);
      setFlag(1);
    }
  }, [userOracles, flag, setOracleId]);

  return (
    <div className="relative w-full ">
      <div className="p-5 bg-white min-h-[230px] shadow-md rounded-lg md:flex flex-col justify-center w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={phronEyeSrc}
              alt="phron icon"
              width={14}
              height={14}
              className="object-contain invert"
            />
            <h2 className="text-lg font-semibold">Oracles</h2>
          </div>

          {userOracles.length > 0 ? (
            userOracles.map((oracle, index) => (
              <div
                key={index}
                className="item cursor-pointer"
                onClick={() => setOracleId(oracle.id)}
              >
                {styledString(oracle.name)}
              </div>
            ))
          ) : (
            <p className="text-sm mt-3 opacity-70">No Oracles found</p>
          )}
        </div>

        <Button className="mt-auto" variant="outline" asChild>
          <Link to="/create-oracle">
            <Plus className="mr-2 w-4 h-4" />
            Add New Oracle
          </Link>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {/* <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="inline-block absolute left-0 top-0 lg:hidden rounded-full"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] border-black"
          >
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              <p>Your Oracles</p>
              <div>
                <ScrollArea className="h-full overflow-auto">
                  {userOracles.map((oracle, index) => (
                    <div
                      key={index}
                      className="item cursor-pointer"
                      onClick={() => setOracleId(oracle.id)}
                    >
                      {styledString(oracle.name)}
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="p-4">
                <Button className="w-full" variant="outline">
                  <Link to="/create-oracle" className="flex gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Oracle</span>
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div> */}
    </div>
  );
};

export default CSidebar;