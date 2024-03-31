"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./table-pagination";
import { fetchTableData } from "../../app/api/thegraphs/fetchData";

export type DataType = {
  token0: {
    symbol: string;
  };
  token1: {
    symbol: string;
  };
  txCount: string;
  volumeUSD: string;
  liquidity: string;
  totalValueLockedUSD: string;
};

export const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "token0.symbol",
    header: "TOKEN 0",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.token0.symbol}</div>
    ),
  },
  {
    accessorKey: "token1.symbol",
    header: "TOKEN 1",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.token1.symbol}</div>
    ),
  },
  {
    accessorKey: "totalValueLockedUSD",
    header: "AMOUNT",
    cell: ({ row }) => {
      const totalValueLockedUSD = parseFloat(
        row.getValue("totalValueLockedUSD")
      );
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalValueLockedUSD);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "txCount",
    header: "TXN",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("txCount")}</div>
    ),
  },
  {
    accessorKey: "volumeUSD",
    header: "VOLUME",
    cell: ({ row }) => {
      const volumeUSD = parseFloat(row.getValue("volumeUSD"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(volumeUSD);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "liquidity",
    header: "LIQUIDITY",
    cell: ({ row }) => {
      const liquidity = parseFloat(row.getValue("liquidity"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(liquidity);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
];

const UNISWAP_URL = "uniswap/uniswap-v3";
const PANCAKESWAP_URL = "pancakeswap/exchange-v3-eth";

export function MyTable({ tabvalue }: { tabvalue: string }) {
  const [displayType, setDisplayType] = useState(tabvalue);
  const [data, setData] = useState<DataType[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const fetchData = async () => {
    let uniswapData, pancakeswapData: any;
    switch (displayType) {
      case "All":
        uniswapData = await fetchTableData(UNISWAP_URL);
        pancakeswapData = await fetchTableData(PANCAKESWAP_URL);
        setData([...uniswapData, ...pancakeswapData] as DataType[]);
        break;
      case "Uniswap":
        uniswapData = await fetchTableData(UNISWAP_URL);
        setData(uniswapData as DataType[]);
        break;
      case "Pancakeswap":
        pancakeswapData = await fetchTableData(PANCAKESWAP_URL);
        setData(pancakeswapData as DataType[]);
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, [displayType, fetchData]);

  return (
    <>
      <div className="w-95 mx-auto my-auto rounded-xl px-5 py-3 bg-white">
        <div className="flex items-center py-4 justify-end">
          <Input
            className="max-w-sm"
            placeholder="Filter by TXN"
            value={
              (table.getColumn("txCount")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("txCount")?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="rounded-md border mb-5">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border border-gray-200 text-center"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="text-center">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border border-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading Data...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
