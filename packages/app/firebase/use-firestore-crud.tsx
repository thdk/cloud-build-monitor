import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import {
    collection,
    deleteDoc,
    doc,
    FirestoreDataConverter,
    FirestoreError,
    getFirestore,
    setDoc,
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

    const collectionRef = useMemo(
        () => (
            collection(
                getFirestore(),
                collectionPath,
            ).withConverter(converter)
        ),
        [
            collectionPath,
            converter,
        ],
    );

    const [firestoreError, setFirestoreError] = useState<FirestoreError | undefined>();

    const [
        activeDocument,
        isActiveDocumentLoading,
        error,
    ] = useDocumentOnce(
        activeDocumentId
            ? doc(
                collectionRef,
                activeDocumentId,
            )
            : null,
    );

    useEffect(
        () => {
            if (error) {
                setFirestoreError(error);
            }
        },
        [
            error,
        ],
    );

    useEffect(
        () => {
            if (
                firestoreError) {
                console.error(firestoreError);
            }
        },
        [
            firestoreError,
        ],
    );

    const createDocument = useCallback(
        (data: T, id?: string) => {
            setDoc(
                id
                    ? doc(
                        collectionRef,
                        id,
                    )
                    : doc(collectionRef),
                data,
            ).then(() => {
                setActiveDocumentId(null);
            }).catch((e) => {
                setFirestoreError(e);
                throw e;
            });

        },
        [
            collectionRef,
        ],
    );

    const updateDocument = useCallback(
        (data: Partial<T>) => {
            activeDocumentId && setDoc(
                doc(
                    collectionRef,
                    activeDocumentId,
                ),
                data,
                {
                    merge: true,
                }
            ).then(() => {
                setActiveDocumentId(null);
            });
        },
        [
            activeDocumentId,
            collectionRef,
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
        error: firestoreError,
    };
}
