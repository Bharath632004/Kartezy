import { useState, useCallback } from 'react';

type FormValues = Record<string, any>;

export function useForm<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (callback: (values: T) => Promise<void> | void) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();
        await callback(values);
      };
    },
    [values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    handleSubmit,
    reset,
  };
}
