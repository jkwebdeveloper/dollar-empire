import React, { useState } from "react";
import SingleOrderHistory from "./SingleOrderHistory";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

const IncompleteOrders = () => {
  const [showSingleOrder, setShowSingleOrder] = useState(false);
  const [incompleteOrders, setIncompleteOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);

  const { t } = useTranslation();

  const { orders, loading } = useSelector((state) => state.orders);
  useEffect(() => {
    if (orders.length > 0 && !loading) {
      const findOrders = orders.filter(
        (order) => order?.status === "Pending" || order.status === "Processing"
      );
      setIncompleteOrders(findOrders);
    }
  }, [loading, orders]);
  return (
    <div className="w-full xl:overflow-auto overflow-x-scroll">
      {showSingleOrder ? (
        <SingleOrderHistory
          orderId={orderId}
          setShowSingleOrder={setShowSingleOrder}
          setOrderId={setOrderId}
        />
      ) : loading ? (
        <p className="text-center w-full mx-auto font-semibold text-2xl">
          {t("Fetching Orders")}...
        </p>
      ) : (
        <>
          <div className="md:block hidden">
            <table className="w-full table-auto overflow-x-scroll">
              <thead>
                <tr className="w-full bg-PRIMARY text-white font-normal">
                  <th className="text-center p-3">{t("Order no")}.</th>
                  {/* <th className="text-center p-3">Type</th> */}
                  <th className="text-center p-3">{t("Order date")}</th>
                  <th className="text-center p-3">{t("Items")}</th>
                  <th className="text-center p-3">{t("Quantity")}</th>
                  <th className="text-center p-3">{t("Amount")}</th>
                  <th className="text-center p-3">{t("Tax")}</th>
                  <th className="text-center p-3">{t("Total")}</th>
                </tr>
              </thead>
              <tbody className="bg-white text-BLACK text-base">
                {incompleteOrders.length > 0 && !loading ? (
                  incompleteOrders.reverse().map((order) => (
                    <tr className="text-center" key={order?._id}>
                      <td
                        onClick={() => {
                          setShowSingleOrder(true);
                          setOrderId(order?._id);
                        }}
                        className="px-3 py-5 underline text-PRIMARY font-semibold cursor-pointer"
                      >
                        {order?.orderId}
                      </td>
                      {/* <td className="px-3 py-5 whitespace-nowrap">
                    {order?.items?.map((item) => item?.type)}
                  </td> */}
                      <td className="px-3 py-5 whitespace-nowrap">
                        {moment(order?.orderDate).format("LL")}
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap">
                        {order?.items?.length}
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap uppercase">
                        {/* {order?.items?.reduce((acc, curr) => {
                      return acc + curr?.quantity;
                    }, 0)} */}
                        {order?.totalQuantity} PC
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap">
                        ${parseInt(order?.total).toFixed(2)}
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap">$0</td>
                      <td className="px-3 py-5 whitespace-nowrap">
                        ${parseInt(order?.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td
                        colSpan="100%"
                        className="text-center font-semibold text-xl p-2"
                      >
                        {t("No orders yet")}.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="100%" className="text-center mx-auto py-3">
                        <Link to="/product-listing/all-products">
                          <button
                            type="button"
                            className="font-semibold mx-auto w-60 bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out p-3 text-center"
                          >
                            {t("Go to products")}
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <table className="w-full overflow-hidden md:hidden">
            <tbody className="bg-white text-BLACK text-base">
              {incompleteOrders.length > 0 && !loading ? (
                incompleteOrders.reverse().map((order) => (
                  <tr className="flex flex-col w-full" key={order?._id}>
                    <tr className="text-center w-full flex flex-row">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Order no")}.
                      </th>
                      <td
                        onClick={() => {
                          setShowSingleOrder(true);
                          setOrderId(order?._id);
                        }}
                        className="p-2 underline w-full text-PRIMARY font-semibold cursor-pointer"
                      >
                        {order?.orderId}
                      </td>
                    </tr>
                    {/* <td className="p-2 whitespace-nowrap">
                    {order?.items?.map((item) => item?.type)}
                  </td> */}
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Order date")}
                      </th>{" "}
                      <td className="p-2 text-center w-full">
                        {moment(order?.orderDate).format("LL")}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Items")}
                      </th>
                      <td className="p-2 text-center w-full">
                        {order?.items?.length}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Quantity")}
                      </th>
                      <td className="p-2 text-center w-full uppercase">
                        {/* {order?.items?.reduce((acc, curr) => {
                        return acc + curr?.quantity;
                      }, 0)} */}
                        {order?.totalQuantity} PC
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Amount")}
                      </th>
                      <td className="p-2 text-center w-full">
                        ${parseInt(order?.total).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Tax")}
                      </th>
                      <td className="p-2 text-center w-full">$0</td>
                    </tr>
                    <tr className="w-full">
                      <th className="bg-PRIMARY text-white p-2 text-center min-w-[5rem] max-w-[5rem]">
                        {t("Total")}
                      </th>
                      <td className="p-2 text-center w-full">
                        ${parseInt(order?.total).toFixed(2)}
                      </td>
                    </tr>
                    <hr className="my-1 " />
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center font-semibold text-xl p-2"
                    >
                      {t("No orders yet")}.
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="100%" className="text-center mx-auto py-3">
                      <Link to="/product-listing/all-products">
                        <button
                          type="button"
                          className="font-semibold mx-auto w-60 bg-PRIMARY text-white hover:bg-white hover:text-PRIMARY border border-PRIMARY duration-300 ease-in-out p-3 text-center"
                        >
                          {t("Go to products")}
                        </button>
                      </Link>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default IncompleteOrders;
