import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import moment from "moment";
import BaseUrl from "../../BaseUrl";
import { useTranslation } from "react-i18next";

const SingleOrderHistory = ({ setShowSingleOrder }) => {
  const { singleOrder, loading } = useSelector((state) => state.orders);

  const { t } = useTranslation();

  return (
    <>
      {loading ? (
        <p className="text-2xl text-center mx-auto font-semibold">
          {t("Fetching Details")}...
        </p>
      ) : (
        <div className="w-full relative z-0 bg-white border border-BORDERGRAY text-BLACK md:space-y-10 space-y-3">
          <div className="p-5 capitalize md:space-y-5 space-y-3 border-b-2 border-gray-100">
            <p className="font-semibold md:text-3xl text-lg text-PRIMARY">
              {t("Order ID")} : {singleOrder?.orderId}
            </p>
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("Shipping method")}:
              </span>{" "}
              <span className="font-normal">{singleOrder?.shippingMethod}</span>
            </p>
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("Order date")}:
              </span>{" "}
              <span className="font-normal">
                {moment(singleOrder?.orderDate).format("lll")}
              </span>
            </p>
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("Items")}:
              </span>{" "}
              <span className="font-normal">{singleOrder?.items.length}</span>
            </p>
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("Quantity")}:
              </span>{" "}
              <span className="font-normal">
                {singleOrder?.totalQuantity} PC
              </span>
            </p>
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("subTotal")}:
              </span>{" "}
              <span className="font-normal">
                ${parseInt(singleOrder?.subtotal).toFixed(2)}
              </span>
            </p>
            {singleOrder?.shippingMethod === "freight" && (
              <p className="flex items-center w-full text-lg">
                <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                  {t("freight charges")}:
                </span>{" "}
                <span className="font-normal">
                  $ {parseFloat(singleOrder?.freight).toFixed(2)}
                </span>
              </p>
            )}
            <p className="flex items-center w-full text-lg">
              <span className="font-bold md:w-40 w-fit mr-2 md:mr-0">
                {t("Total")}:
              </span>{" "}
              <span className="font-normal">
                ${parseFloat(singleOrder?.total).toFixed(2)}
              </span>
            </p>
          </div>
          {/* products */}
          {/* for desk & tablet */}
          <div className="w-full overflow-x-scroll scrollbar md:inline-block hidden">
            <table className="w-full table-auto overflow-x-scroll">
              <thead>
                <tr className=" bg-PRIMARY text-white w-full">
                  <th className="p-3 text-left min-w-[20rem]">
                    {t("Product")}
                  </th>
                  <th className="p-3 text-center min-w-[8rem]">
                    {t("Item no")}.
                  </th>
                  <th className="p-3 text-center w-28">{t("Price")}</th>
                  <th className="p-3 text-center w-28">{t("Quantity")}</th>
                  <th className="p-3 text-center w-28">{t("Subtotal")}</th>
                </tr>
              </thead>
              <tbody>
                {singleOrder?.items.map((product) => (
                  <tr className="text-center" key={product?._id}>
                    <td className="p-3 flex gap-x-3 whitespace-normal items-center">
                      <img
                        src={BaseUrl.concat(product?.product?.images[0])}
                        alt={product?.product?.name}
                        className="min-w-[6rem] min-h-[6rem] max-w-[6rem] max-h-[6rem] object-contain object-center"
                      />
                      <span className="font-semibold text-left">
                        {product?.product?.name}
                      </span>
                    </td>
                    <td className="p-3">#{product?.product?.number}</td>
                    <td className="p-3">${product?.product?.price}</td>
                    <td className="p-3 uppercase">
                      {product?.quantity} {product?.type}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {product?.type === "pk"
                        ? `$ ${parseFloat(
                            product?.product?.price *
                              product?.quantity *
                              product?.product?.PK
                          ).toFixed(2)}`
                        : `$
                      ${parseFloat(
                        product?.product?.price *
                          product?.quantity *
                          product?.product?.CTN
                      ).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* for mobile */}
          <div className="w-full overflow-hidden md:hidden block">
            <table className="w-full table-auto">
              <tbody>
                {singleOrder?.items.map((product) => (
                  <tr className="flex flex-col w-full" key={product?._id}>
                    <tr className="text-center w-full flex flex-row">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Product")}
                      </th>
                      <td className="p-2 flex gap-x-1 items-center text-center mx-auto">
                        <img
                          src={BaseUrl.concat(product?.product?.images[0])}
                          alt={product?.product?.name}
                          className="min-w-[6rem] max-w-[6rem] object-contain object-center mx-auto"
                        />
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Name")}
                      </th>
                      <td className="p-2 text-center w-full">
                        <span className="font-semibold text-left">
                          {product?.product?.name}
                        </span>
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Item no")}.
                      </th>
                      <td className="p-2 text-center w-full">
                        #{product?.product?.number}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Price")}
                      </th>
                      <td className="p-2 text-center w-full">
                        ${product?.product?.price}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Quantity")}{" "}
                      </th>
                      <td className="p-2 text-center w-full uppercase">
                        {product?.quantity} {product?.type}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY min-w-[5rem] max-w-[5rem] p-2 text-center text-white">
                        {t("Subtotal")}
                      </th>
                      <td className="p-2 text-center w-full">
                        {product?.type === "pk"
                          ? `$ ${parseFloat(
                              product?.product?.price *
                                product?.quantity *
                                product?.product?.PK
                            ).toFixed(2)}`
                          : `$
                      ${parseFloat(
                        product?.product?.price *
                          product?.quantity *
                          product?.product?.CTN
                      ).toFixed(2)}`}
                      </td>
                    </tr>
                    <hr className="my-1" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AiOutlineClose
            role="button"
            onClick={() => {
              setShowSingleOrder(false);
            }}
            className="h-6 w-6 absolute md:-top-5 top-0 right-2 z-10 text-black"
          />
        </div>
      )}
    </>
  );
};

export default SingleOrderHistory;
