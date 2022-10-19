import {
  PaperAirplaneIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  BeakerIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import Menu from "../../../components/Menu";
import Link from "next/link";
import { supabase } from "../../../supabase";

export default function Group() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");
  const [groupData, setGroupData] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  function changePrivate() {
    setIsPrivate(!isPrivate);
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
  }

  function remove() {}

  function save() {}

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
    setGroup(groupData.name);
    setIsPrivate(!groupData.public);
  }

  useEffect(() => {
    async function func() {
      if (router.isReady) {
        const { data } = await supabase
          .from("groups")
          .select("*")
          .eq("public_id", router.query.group);

        setGroupData(data[0]);
        setGroup(data[0].name);
        setIsPrivate(!data[0].public);
      }
    }

    func();
  }, [router, supabase]);

  return (
    <>
      <Head>
        <title>
          {groupData ? groupData.name + " - " : ""}Школа моделирования
        </title>
      </Head>
      {modal && (
        <>
          <div
            onClick={hideModal}
            className="cursor-pointer fixed left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
          ></div>
          <div className="p-4 z-20 bottom-0 rounded-t-lg sm:bottom-auto sm:rounded-lg text-lg fixed mx-auto left-0 right-0 bg-neutral-900 w-full w-full sm:max-w-xs mt-32">
            <div className="flex items-center justify-between ml-3">
              Настройки группы
              <button
                className="md:hover:bg-neutral-800 p-2 rounded-lg"
                onClick={hideModal}
              >
                <XMarkIcon className="w-6" />
              </button>
            </div>
            <div className="mx-3">
              <div className="mt-4">Название</div>
              <input
                value={group}
                onChange={changeGroup}
                className="rounded-lg mt-2 px-3 py-2 w-full"
              />
              <button
                className="flex w-full items-center mt-4"
                onClick={changePrivate}
              >
                <div className="h-6 w-6 border-2 mr-4 rounded flex justify-center items-center">
                  <div className={`${isPrivate ? "h-4 w-4 rounded-sm bg-blue-500" : ""}`}></div>
                </div>
                Приватная
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={remove}
                className="block mt-4 px-3 py-2 md:hover:bg-neutral-800 text-red-500 rounded-lg"
              >
                Удалить
              </button>
              <button
                onClick={save}
                className="block mt-4 px-3 py-2 md:hover:bg-neutral-800 rounded-lg"
              >
                Сохранить
              </button>
            </div>
          </div>
        </>
      )}
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            {groupData && (
              <>
                <div className="flex justify-between my-4">
                  <div className="font-bold text-2xl">{groupData.name}</div>
                  <button
                    onClick={showModal}
                    className="sm:hover:bg-neutral-800 rounded-xl p-2 -mr-2"
                  >
                    <Cog6ToothIcon className="w-6" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-lg">
                  <Link href={`/groups/${groupData.public_id}/tasks`}>
                    <a className="flex items-center sm:hover:bg-neutral-800 border-2 border-green-500 text-green-500 h-32 sm:h-auto row-span-2 py-4 px-5">
                      <BeakerIcon className="w-6 mr-4" />
                      Задания
                    </a>
                  </Link>
                  <Link href={`/groups/${groupData.public_id}/members`}>
                    <a className="flex items-center sm:hover:bg-neutral-800 border-2 border-cyan-500 text-cyan-500 h-32 py-4 px-5">
                      <UserGroupIcon className="w-6 mr-4" />
                      Участники
                    </a>
                  </Link>
                  <Link href={`/groups/${groupData.public_id}/chat`}>
                    <a className="flex items-center sm:hover:bg-neutral-800 border-2 border-violet-500 text-violet-500 h-32 py-4 px-5">
                      <PaperAirplaneIcon className="w-6 mr-4" />
                      Сообщения
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Content>
    </>
  );
}
