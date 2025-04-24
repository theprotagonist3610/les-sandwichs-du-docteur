import React, { useState } from "react";

const Menu = ({ titre, menuItems }) => {
  return (
    <div className="min-h-[750px] w-full mb-4 px-4 sm:px-0">
      <section className="bg-doctor-orange/30 w-full max-w-[1200px] mx-auto backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
          {titre}
        </h2>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
            {menuItems.map((el, index) => (
              <div
                key={index}
                className="group flex flex-col justify-between w-full md:w-[45%] lg:w-[30%] min-h-[500px] bg-amber-50 hover:bg-doctor-orange/500 hover:border-2 hover:border-deeporange-50 rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl sm:text-3xl text-center font-bold mb-4">
                  {el.title}
                </div>

                <div className="w-full h-[250px] sm:h-[300px] overflow-hidden rounded-lg">
                  <img
                    src={el.image}
                    alt={el.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-110 object-cover"
                  />
                </div>

                <div className="my-4 text-sm sm:text-base">
                  {el.description}
                </div>
                <div className="font-semibold">{`Prix : ${el.price}`}</div>

                <div className="mt-auto pt-4">
                  <button className="w-full sm:w-[60%] md:w-[40%] ml-auto text-center rounded-xl bg-doctor-orange hover:bg-doctor-deeporange hover:border hover:text-white font-bold cursor-pointer py-2">
                    {"Commander"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    // <div className="h-[750px] w-[100%] mb-4">
    //   <section className="bg-doctor-orange/30 h-[700px] w-[90%] mx-auto backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
    //     <h2 className="text-3xl font-bold text-center mb-12">{"Menu Matin"}</h2>
    //     <div className="container mx-auto">
    //       <div className="flex justify-between flex-wrap -mx-4">
    //         {menuItems.map((el, index) => (
    //           <div
    //             key={index}
    //             className="group flex flex-col justify-between w-[30%] h-[500px] bg-amber-50 hover:bg-doctor-orange/500 hover:border hover:border-2 hover:border-deeporange-50 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
    //             <div className="text-3xl text-center font-bold">{el.title}</div>
    //             <div className="w-[98%] h-[300px] overflow-hidden">
    //               <img
    //                 src={el.image}
    //                 className="w-full h-full transition-transform duration-300 group-hover:scale-110 object-cover"></img>
    //             </div>
    //             <div className="">{el.description}</div>
    //             <div className="">{`Prix : ${el.price}`}</div>
    //             <div className="">
    //               <div className="w-[40%] ml-auto text-center rounded-xl bg-doctor-orange hover:bg-doctor-deeporange hover:border hover:text-white font-bold cursor-pointer">
    //                 {"Commander"}
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>
    // </div>
  );
};

export default Menu;
