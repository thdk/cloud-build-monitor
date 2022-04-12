import { useCallback, useEffect, useState } from "react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import {
    collection,
    deleteDoc,
    doc,
    FirestoreDataConverter,
    getFirestore,
    setDoc,
    UpdateData,
    updateDoc,
} from "firebase/firestore";

export function useFirestoreCrud<T>({
    collectionPath,
    converter,
}: {
    collectionPath: string;
    converter: FirestoreDataConverter<T>;
}) {
    const [
        activeDocumentId,
        setActiveDocumentId,
    ] = useState<string | undefined | null>(null);

    const [
        activeDocument,
        isActiveDocumentLoading,
        error,
    ] = useDocumentOnce(
        activeDocumentId
            ? doc(
                collection(
                    getFirestore(),
                    collectionPath,
                ).withConverter(converter),
                activeDocumentId,
            )
            : null,
    );

    useEffect(
        () => {
            if (error) {
                console.error(error);
            }
        },
        [
            error,
        ],
    );

    const createDocument = useCallback(
        (data: T) => {
            setDoc(
                doc(
                    collection(
                        getFirestore(),
                        collectionPath,
                    ).withConverter(converter),
                ),
                data,
            ).then(() => {
                setActiveDocumentId(null);
            });
        },
        [
            collectionPath,
            converter,
        ],
    );

    const updateDocument = useCallback(
        (data: UpdateData<T>) => {
            activeDocumentId && updateDoc(
                doc(
                    collection(
                        getFirestore(),
                        collectionPath,
                    ).withConverter(converter),
                    activeDocumentId,
                ),
                data,
            ).then(() => {
                setActiveDocumentId(null);
            });
        },
        [
            activeDocumentId,
            collectionPath,
            converter,
        ],
    );

    const deleteDocument = useCallback(
        () => {
            deleteDoc(
                doc(
                    getFirestore(),
                    `${collectionPath}/${activeDocumentId}`
                ),
            ).then(() => {
                setActiveDocumentId(null);
            });
        },
        [
            activeDocumentId,
            collectionPath,
        ],
    );

    return {
        activeDocument: activeDocumentId !== null ? activeDocument : null,
        createDocument,
        deleteDocument,
        isActiveDocumentLoading,
        updateDocument,
        setActiveDocumentId,
    };
}
